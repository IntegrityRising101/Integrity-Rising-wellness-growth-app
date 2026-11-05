-- Integrity Rising / The Integrity Movement
-- Member blocking: blocked members' published community content is excluded
-- from the blocker's reads. A member can still access their own submissions.
-- Apply after migrations 001 and 002.

drop policy if exists "Members read published posts or own posts" on public.community_posts;
create policy "Members read posts with personal block filtering"
on public.community_posts for select to authenticated
using (
  (
    status = 'published'
    or auth.uid() = user_id
    or (select public.is_community_moderator())
  )
  and (
    auth.uid() = user_id
    or (select public.is_community_moderator())
    or not exists (
      select 1
      from public.user_blocks b
      where b.blocker_id = (select auth.uid())
        and b.blocked_id = community_posts.user_id
    )
  )
);

drop policy if exists "Members read published comments or related own content" on public.community_comments;
create policy "Members read comments with personal block filtering"
on public.community_comments for select to authenticated
using (
  (
    status = 'published'
    or auth.uid() = user_id
    or exists (
      select 1
      from public.community_posts p
      where p.id = community_comments.post_id
        and p.user_id = (select auth.uid())
    )
    or (select public.is_community_moderator())
  )
  and (
    auth.uid() = user_id
    or (select public.is_community_moderator())
    or not exists (
      select 1
      from public.user_blocks b
      where b.blocker_id = (select auth.uid())
        and b.blocked_id = community_comments.user_id
    )
  )
);

-- user_blocks remains private to the member who created each block.
-- Its owner-only RLS policy is established in migration 001.
