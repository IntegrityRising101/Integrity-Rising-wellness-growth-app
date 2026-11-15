-- Integrity Rising: allow members to delete only their own chat messages.
-- Moderators may remove any chat message through the authorized moderation workflow.
-- Run this migration in Supabase SQL Editor after migrations 005/008.

drop policy if exists "Members delete own room messages" on public.community_room_messages;
create policy "Members delete own room messages"
on public.community_room_messages
for delete to authenticated
using (
  auth.uid() = user_id
  or (select public.is_community_moderator())
);

grant delete on public.community_room_messages to authenticated;
