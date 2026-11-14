-- Integrity Rising / The Integrity Movement
-- Migration 005: topic-based member chat rooms.
-- Apply after the existing community and member migrations.
--
-- Safety model:
-- - Only authenticated members can read rooms and messages.
-- - Members can send messages only as themselves.
-- - Messages are append-only for members; moderation is handled separately.
-- - Do not post identifying or highly sensitive personal information.
-- - Peer chat is not monitored continuously and is not crisis care.

create table if not exists public.community_rooms (
  id text primary key,
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 240),
  guidelines text not null default '' check (char_length(guidelines) <= 1000),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.community_room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.community_rooms(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists community_room_messages_room_created_idx
  on public.community_room_messages(room_id, created_at desc);
create index if not exists community_room_messages_user_created_idx
  on public.community_room_messages(user_id, created_at desc);

create table if not exists public.community_room_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.community_room_messages(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('harassment','threat','hate','personal_information','spam','other')),
  details text not null default '' check (char_length(details) <= 1000),
  created_at timestamptz not null default now(),
  unique (message_id, reporter_id)
);

alter table public.community_rooms enable row level security;
alter table public.community_room_messages enable row level security;
alter table public.community_room_reports enable row level security;

drop policy if exists "Signed-in members can view active community rooms" on public.community_rooms;
create policy "Signed-in members can view active community rooms"
on public.community_rooms for select to authenticated
using (is_active = true);

drop policy if exists "Signed-in members can view room messages" on public.community_room_messages;
create policy "Signed-in members can view room messages"
on public.community_room_messages for select to authenticated
using (
  exists (
    select 1 from public.community_rooms r
    where r.id = room_id and r.is_active = true
  )
);

drop policy if exists "Members can send their own room messages" on public.community_room_messages;
create policy "Members can send their own room messages"
on public.community_room_messages for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.community_rooms r
    where r.id = room_id and r.is_active = true
  )
);

drop policy if exists "Members can report room messages" on public.community_room_reports;
create policy "Members can report room messages"
on public.community_room_reports for insert to authenticated
with check (auth.uid() = reporter_id);

drop policy if exists "Members can view their own room reports" on public.community_room_reports;
create policy "Members can view their own room reports"
on public.community_room_reports for select to authenticated
using (auth.uid() = reporter_id);

insert into public.community_rooms (id, name, description, guidelines, sort_order)
values
  ('trauma-healing', 'Trauma & Healing', 'A compassionate space for grounding, recovery, and taking healing one step at a time.', 'Share only what feels safe. Avoid graphic details and identifying information. Respect each member''s pace. Peer support is not therapy.', 1),
  ('addiction-recovery', 'Addiction Recovery', 'Encouragement, accountability, and support for recovery at every stage.', 'Offer support without judgment or pressure. Do not recommend unsafe detox or treatment plans. Seek qualified medical help when needed.', 2),
  ('mental-wellness', 'Mental Wellness', 'Talk about stress, emotions, coping skills, and everyday well-being.', 'Be respectful and nonjudgmental. Do not diagnose others or present peer opinions as professional care.', 3),
  ('toxic-relationships', 'Toxic Relationships', 'Discuss boundaries, self-worth, relationship patterns, and rebuilding confidence.', 'Do not pressure anyone to leave or stay in a relationship. Protect privacy and consider device safety when needed.', 4),
  ('personal-growth', 'Personal Growth', 'Share goals, healthy habits, lessons, and small wins.', 'Encourage without comparing or shaming. Every member chooses their own pace.', 5),
  ('purpose-legacy', 'Purpose & Legacy', 'Explore leadership, values, purpose, and the difference you want to make.', 'Keep discussion constructive, inclusive, and grounded in respect.', 6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  guidelines = excluded.guidelines,
  sort_order = excluded.sort_order;

-- Enable Supabase Realtime for room messages when the publication exists.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'community_room_messages'
     ) then
    alter publication supabase_realtime add table public.community_room_messages;
  end if;
end $$;
