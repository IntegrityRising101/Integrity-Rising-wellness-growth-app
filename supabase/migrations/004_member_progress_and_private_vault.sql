-- Integrity Rising / The Integrity Movement
-- Migration 004: complete member progress foundation.
-- Apply after migrations 001, 002, and 003.
--
-- IMPORTANT PRIVACY DESIGN:
-- 1. Every table below is protected by owner-only Row Level Security.
-- 2. Do not store plaintext incident notes, safety plans, or AI conversations.
-- 3. private_vault_items accepts client-side encrypted payloads only. The app must
--    encrypt before upload and must never send encryption keys to Supabase.
-- 4. This migration creates database structures only; frontend features must be
--    connected and tested before members rely on cloud saving.

create table if not exists public.member_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  first_step text not null default '' check (char_length(first_step) <= 180),
  target_date date,
  is_completed boolean not null default false,
  created_on date not null default current_date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goal_tasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.member_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wellness_practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_key text not null check (char_length(practice_key) between 1 and 80),
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, practice_key, completed_on)
);

create table if not exists public.academy_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_key text not null check (char_length(course_key) between 1 and 100),
  lesson_key text not null check (char_length(lesson_key) between 1 and 120),
  is_completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_key, lesson_key)
);

create table if not exists public.saved_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_key text not null check (char_length(resource_key) between 1 and 160),
  resource_type text not null default 'general' check (resource_type in ('general','mental_health','domestic_violence','legal','housing','education','community')),
  saved_at timestamptz not null default now(),
  unique (user_id, resource_key)
);

create table if not exists public.member_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null default 'America/Chicago' check (char_length(timezone) between 1 and 80),
  preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(preferences) = 'object'),
  updated_at timestamptz not null default now()
);

-- Encrypted personal vault: encrypted_payload must be ciphertext produced in the
-- browser before upload. Never put plaintext incident descriptions or keys here.
create table if not exists public.private_vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  encrypted_payload text not null check (char_length(encrypted_payload) between 1 and 50000),
  encryption_version text not null default 'v1' check (char_length(encryption_version) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_goals_user_created_idx
  on public.member_goals(user_id, created_at desc);
create index if not exists goal_tasks_user_goal_idx
  on public.goal_tasks(user_id, goal_id, created_at);
create index if not exists wellness_practice_logs_user_date_idx
  on public.wellness_practice_logs(user_id, completed_on desc);
create index if not exists academy_lesson_progress_user_course_idx
  on public.academy_lesson_progress(user_id, course_key);
create index if not exists saved_resources_user_saved_idx
  on public.saved_resources(user_id, saved_at desc);
create index if not exists private_vault_items_user_updated_idx
  on public.private_vault_items(user_id, updated_at desc);

drop trigger if exists member_goals_set_updated_at on public.member_goals;
create trigger member_goals_set_updated_at before update on public.member_goals
for each row execute function public.set_updated_at();

drop trigger if exists academy_lesson_progress_set_updated_at on public.academy_lesson_progress;
create trigger academy_lesson_progress_set_updated_at before update on public.academy_lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists member_preferences_set_updated_at on public.member_preferences;
create trigger member_preferences_set_updated_at before update on public.member_preferences
for each row execute function public.set_updated_at();

drop trigger if exists private_vault_items_set_updated_at on public.private_vault_items;
create trigger private_vault_items_set_updated_at before update on public.private_vault_items
for each row execute function public.set_updated_at();

alter table public.member_goals enable row level security;
alter table public.goal_tasks enable row level security;
alter table public.wellness_practice_logs enable row level security;
alter table public.academy_lesson_progress enable row level security;
alter table public.saved_resources enable row level security;
alter table public.member_preferences enable row level security;
alter table public.private_vault_items enable row level security;

create policy "Members manage own goals"
on public.member_goals for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Members manage own goal tasks"
on public.goal_tasks for all to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.member_goals g
    where g.id = goal_id and g.user_id = (select auth.uid())
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.member_goals g
    where g.id = goal_id and g.user_id = (select auth.uid())
  )
);

create policy "Members manage own wellness practice logs"
on public.wellness_practice_logs for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Members manage own academy progress"
on public.academy_lesson_progress for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Members manage own saved resources"
on public.saved_resources for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Members manage own preferences"
on public.member_preferences for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Members manage own encrypted vault items"
on public.private_vault_items for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- No anonymous access policies are created.
