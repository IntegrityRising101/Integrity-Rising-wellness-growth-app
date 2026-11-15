-- Integrity Rising / The Integrity Movement
-- Migration 009: connect private chat-room reports to moderator review.
-- Requires migration 002 (is_community_moderator) and migration 005.

alter table public.community_room_reports
  add column if not exists status text not null default 'open';

alter table public.community_room_reports
  drop constraint if exists community_room_reports_status_check;

alter table public.community_room_reports
  add constraint community_room_reports_status_check
  check (status in ('open', 'reviewing', 'resolved', 'dismissed'));

create index if not exists community_room_reports_status_created_idx
  on public.community_room_reports(status, created_at asc);

drop policy if exists "Members can view their own room reports" on public.community_room_reports;
drop policy if exists "Reporters and moderators read room reports" on public.community_room_reports;
create policy "Reporters and moderators read room reports"
on public.community_room_reports for select to authenticated
using (auth.uid() = reporter_id or (select public.is_community_moderator()));

drop policy if exists "Moderators update room report status" on public.community_room_reports;
create policy "Moderators update room report status"
on public.community_room_reports for update to authenticated
using ((select public.is_community_moderator()))
with check ((select public.is_community_moderator()));

grant select, insert, update on public.community_room_reports to authenticated;

-- Keep message reports private to their reporter and authorized moderators.
