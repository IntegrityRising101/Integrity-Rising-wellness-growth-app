-- Integrity Rising — chat-room consistency and member-owned deletion
-- Apply after migrations 001-011. Review existing migration history before running.
-- Adds the Purpose & Legacy room already defined by the client welcome content.
-- Allows members to delete only their own chat messages; no message editing is granted.

insert into public.community_rooms (id, name, description, guidelines, sort_order, is_active)
values (
  'purpose-legacy',
  'Purpose & Legacy',
  'Purpose, values, meaningful choices, and the legacy you want to leave.',
  'Lead with honesty, humility, compassion, and accountability. Encourage others, respect different perspectives, and protect privacy.',
  6,
  true
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  guidelines = excluded.guidelines,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Shift Accountability & Leadership to the seventh position so ordering is stable.
update public.community_rooms
set sort_order = 7
where id = 'accountability-leadership';

drop policy if exists "Members delete their own room messages" on public.community_room_messages;
create policy "Members delete their own room messages"
on public.community_room_messages for delete to authenticated
using (auth.uid() = user_id);

grant delete on public.community_room_messages to authenticated;

-- Deliberately do not grant UPDATE: published messages remain immutable.
