-- Integrity Rising / The Integrity Movement
-- Initial private-data and community schema.
-- Apply only after reviewing the policies in a Supabase project.
-- All wellness, journal, and women's-health records are private to their owner.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Movement Member' check (char_length(display_name) between 1 and 60),
  bio text not null default '' check (char_length(bio) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null check (mood in ('great','good','okay','low','overwhelmed','calm','anxious','sad','angry','lonely','numb')),
  note text not null default '' check (char_length(note) <= 1000),
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '' check (char_length(title) <= 120),
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.womens_wellness_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  last_period_date date,
  typical_cycle_days integer check (typical_cycle_days between 15 and 60),
  symptoms text[] not null default '{}',
  notes text not null default '' check (char_length(notes) <= 1500),
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('Encouragement','Healing & Growth','Healthy Relationships','Accountability','General')),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 3000),
  status text not null default 'published' check (status in ('published','hidden','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1200),
  status text not null default 'published' check (status in ('published','hidden','removed')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete set null,
  comment_id uuid references public.community_comments(id) on delete set null,
  reason text not null check (reason in ('harassment','threat','hate','personal_information','spam','other')),
  details text not null default '' check (char_length(details) <= 1500),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  check (num_nonnulls(post_id, comment_id) = 1)
);

create table if not exists public.user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index if not exists mood_checkins_user_date_idx on public.mood_checkins(user_id, checked_in_at desc);
create index if not exists journal_entries_user_date_idx on public.journal_entries(user_id, updated_at desc);
create index if not exists womens_wellness_user_date_idx on public.womens_wellness_checkins(user_id, checked_in_at desc);
create index if not exists community_posts_feed_idx on public.community_posts(status, created_at desc);
create index if not exists community_comments_post_idx on public.community_comments(post_id, created_at);
create index if not exists community_reports_status_idx on public.community_reports(status, created_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists journal_entries_set_updated_at on public.journal_entries;
create trigger journal_entries_set_updated_at before update on public.journal_entries
for each row execute function public.set_updated_at();

drop trigger if exists community_posts_set_updated_at on public.community_posts;
create trigger community_posts_set_updated_at before update on public.community_posts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.mood_checkins enable row level security;
alter table public.journal_entries enable row level security;
alter table public.womens_wellness_checkins enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reports enable row level security;
alter table public.user_blocks enable row level security;

-- Profiles expose only the fields in this table; never store account email here.
create policy "Profiles are visible to signed-in members"
on public.profiles for select to authenticated using (true);
create policy "Members create their own profile"
on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Members update their own profile"
on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Private wellness and journal records: owner-only access.
create policy "Own mood check-ins only"
on public.mood_checkins for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own journal entries only"
on public.journal_entries for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own women's wellness records only"
on public.womens_wellness_checkins for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Community content is visible to signed-in members; authors manage only their own content.
create policy "Members read published posts"
on public.community_posts for select to authenticated
using (status = 'published' or auth.uid() = user_id);
create policy "Members create own posts"
on public.community_posts for insert to authenticated
with check (auth.uid() = user_id);
create policy "Authors update own posts"
on public.community_posts for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Authors delete own posts"
on public.community_posts for delete to authenticated
using (auth.uid() = user_id);

create policy "Members read published comments"
on public.community_comments for select to authenticated
using (
  status = 'published'
  or auth.uid() = user_id
  or exists (select 1 from public.community_posts p where p.id = post_id and p.user_id = auth.uid())
);
create policy "Members create own comments"
on public.community_comments for insert to authenticated
with check (auth.uid() = user_id);
create policy "Authors update own comments"
on public.community_comments for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Authors delete own comments"
on public.community_comments for delete to authenticated
using (auth.uid() = user_id);

-- Reports are confidential to the reporter. A trusted moderator workflow must be added
-- before staff access is enabled; never expose report details to the public feed.
create policy "Members submit reports"
on public.community_reports for insert to authenticated
with check (auth.uid() = reporter_id);
create policy "Reporters read their own reports"
on public.community_reports for select to authenticated
using (auth.uid() = reporter_id);

create policy "Members manage their own blocks"
on public.user_blocks for all to authenticated
using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

-- No anonymous policies are intentionally created.
