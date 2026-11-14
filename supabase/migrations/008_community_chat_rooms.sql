-- Integrity Rising / The Integrity Movement
-- Private member chat rooms. Apply only after reviewing and testing RLS with
-- separate member and moderator accounts in a non-production environment.

create table if not exists public.community_rooms (
  id text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
  name text not null check (char_length(name) between 2 and 80),
  description text not null default '' check (char_length(description) <= 240),
  guidelines text not null default 'Be respectful. Share only what feels safe. Protect your privacy.' check (char_length(guidelines) <= 500),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.community_room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.community_rooms(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.community_room_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.community_room_messages(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('harassment','threat','hate','personal_information','spam','other')),
  details text not null default '' check (char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  constraint community_room_reports_one_per_member unique (message_id, reporter_id)
);

create index if not exists community_room_messages_room_created_idx
  on public.community_room_messages(room_id, created_at desc);
create index if not exists community_room_reports_status_created_idx
  on public.community_room_reports(status, created_at desc);

insert into public.community_rooms (id, name, description, guidelines, sort_order, is_active)
values
  ('trauma-healing', 'Trauma & Healing', 'A compassionate space for healing at your own pace.', 'Share only what feels safe. Listen without judgment. Do not pressure anyone to describe traumatic experiences.', 1, true),
  ('addiction-recovery', 'Addiction Recovery', 'Encouragement and support through recovery.', 'Offer encouragement, not medical advice. Respect every person’s recovery path and privacy.', 2, true),
  ('toxic-relationships', 'Toxic Relationships', 'Boundaries, self-worth, and healthy relationships.', 'Support autonomy and safety. Do not blame, diagnose, or pressure anyone to leave or stay.', 3, true),
  ('mental-wellness', 'Mental Wellness', 'Stress, emotions, and everyday well-being.', 'Be kind and respectful. This room is peer support, not therapy or crisis response.', 4, true),
  ('personal-growth', 'Personal Growth', 'Goals, habits, and small wins.', 'Celebrate progress without comparison. Keep advice practical and compassionate.', 5, true),
  ('accountability-leadership', 'Accountability & Leadership', 'Integrity, responsibility, and making a positive difference.', 'Lead with honesty, humility, and respect. Accountability is not shaming.', 6, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  guidelines = excluded.guidelines,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

alter table public.community_rooms enable row level security;
alter table public.community_room_messages enable row level security;
alter table public.community_room_reports enable row level security;

drop policy if exists "Signed-in members view active chat rooms" on public.community_rooms;
create policy "Signed-in members view active chat rooms"
on public.community_rooms for select to authenticated
using (is_active = true);

drop policy if exists "Signed-in members read room messages" on public.community_room_messages;
create policy "Signed-in members read room messages"
on public.community_room_messages for select to authenticated
using (exists (
  select 1 from public.community_rooms r
  where r.id = room_id and r.is_active = true
));

drop policy if exists "Members send their own room messages" on public.community_room_messages;
create policy "Members send their own room messages"
on public.community_room_messages for insert to authenticated
with check (
  auth.uid() = user_id
  and char_length(btrim(body)) between 1 and 2000
  and exists (
    select 1 from public.community_rooms r
    where r.id = room_id and r.is_active = true
  )
);

-- Messages cannot be edited or deleted through the public client.
-- Moderators can review confidential reports; only the reporter can otherwise read one.
drop policy if exists "Members submit room message reports" on public.community_room_reports;
create policy "Members submit room message reports"
on public.community_room_reports for insert to authenticated
with check (
  auth.uid() = reporter_id
  and exists (
    select 1 from public.community_room_messages m
    where m.id = message_id and m.user_id <> auth.uid()
  )
);

drop policy if exists "Reporters and moderators read room reports" on public.community_room_reports;
create policy "Reporters and moderators read room reports"
on public.community_room_reports for select to authenticated
using (auth.uid() = reporter_id or (select public.is_community_moderator()));

drop policy if exists "Moderators update room report status" on public.community_room_reports;
create policy "Moderators update room report status"
on public.community_room_reports for update to authenticated
using ((select public.is_community_moderator()))
with check ((select public.is_community_moderator()));

grant select on public.community_rooms to authenticated;
grant select, insert on public.community_room_messages to authenticated;
grant select, insert, update on public.community_room_reports to authenticated;

-- Enable Supabase Realtime for chat messages when the standard publication exists.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.community_room_messages;
    exception when duplicate_object then
      null;
    end;
  end if;
end;
$$;

-- No anonymous access is granted. Do not open chat to the public until RLS,
-- moderator access, reporting, and deletion workflows have been tested.
