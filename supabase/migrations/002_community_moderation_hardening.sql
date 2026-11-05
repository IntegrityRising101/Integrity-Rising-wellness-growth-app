-- Integrity Rising / The Integrity Movement
-- Community moderation hardening.
-- New member content is held for review until an authorized moderator publishes it.

create table if not exists public.community_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.community_moderators enable row level security;
-- Intentionally no client-facing policies: manage moderator assignments only
-- through a trusted Supabase admin/service-role process.

create or replace function public.is_community_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.community_moderators m
    where m.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_community_moderator() from public;
grant execute on function public.is_community_moderator() to authenticated;

-- Expand allowed states and hold all new content for review.
alter table public.community_posts
  drop constraint if exists community_posts_status_check;
alter table public.community_posts
  add constraint community_posts_status_check
  check (status in ('pending','published','hidden','removed'));
alter table public.community_posts
  alter column status set default 'pending';

alter table public.community_comments
  drop constraint if exists community_comments_status_check;
alter table public.community_comments
  add constraint community_comments_status_check
  check (status in ('pending','published','hidden','removed'));
alter table public.community_comments
  alter column status set default 'pending';

-- Replace community post policies so authors cannot self-publish or alter moderation state.
drop policy if exists "Members read published posts" on public.community_posts;
drop policy if exists "Members create own posts" on public.community_posts;
drop policy if exists "Authors update own posts" on public.community_posts;
drop policy if exists "Authors delete own posts" on public.community_posts;

create policy "Members read published posts or own posts"
on public.community_posts for select to authenticated
using (status = 'published' or auth.uid() = user_id or (select public.is_community_moderator()));

create policy "Members submit posts for review"
on public.community_posts for insert to authenticated
with check (auth.uid() = user_id and status = 'pending');

create policy "Authors edit pending posts"
on public.community_posts for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id and status = 'pending');

create policy "Moderators manage post moderation"
on public.community_posts for update to authenticated
using ((select public.is_community_moderator()))
with check ((select public.is_community_moderator()));

create policy "Authors or moderators delete posts"
on public.community_posts for delete to authenticated
using (auth.uid() = user_id or (select public.is_community_moderator()));

-- Replace comment policies with the same review workflow.
drop policy if exists "Members read published comments" on public.community_comments;
drop policy if exists "Members create own comments" on public.community_comments;
drop policy if exists "Authors update own comments" on public.community_comments;
drop policy if exists "Authors delete own comments" on public.community_comments;

create policy "Members read published comments or related own content"
on public.community_comments for select to authenticated
using (
  status = 'published'
  or auth.uid() = user_id
  or exists (
    select 1 from public.community_posts p
    where p.id = post_id and p.user_id = (select auth.uid())
  )
  or (select public.is_community_moderator())
);

create policy "Members submit comments for review"
on public.community_comments for insert to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and exists (
    select 1 from public.community_posts p
    where p.id = post_id and p.status = 'published'
  )
);

create policy "Authors edit pending comments"
on public.community_comments for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id and status = 'pending');

create policy "Moderators manage comment moderation"
on public.community_comments for update to authenticated
using ((select public.is_community_moderator()))
with check ((select public.is_community_moderator()));

create policy "Authors or moderators delete comments"
on public.community_comments for delete to authenticated
using (auth.uid() = user_id or (select public.is_community_moderator()));

-- Only the reporter and trusted moderators can read confidential reports.
drop policy if exists "Reporters read their own reports" on public.community_reports;
create policy "Reporters and moderators read reports"
on public.community_reports for select to authenticated
using (auth.uid() = reporter_id or (select public.is_community_moderator()));

create policy "Moderators update report status"
on public.community_reports for update to authenticated
using ((select public.is_community_moderator()))
with check ((select public.is_community_moderator()));

-- Existing content is not automatically published or hidden by this migration.
-- Existing rows retain their current status; only new content defaults to pending.
