-- Private member milestones. Apply after migrations 001-010.
create table if not exists public.member_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  category text not null default 'Personal growth'
    check (category in ('Personal growth','Wellness','Resilience','Relationships','Learning','Community','Other')),
  is_completed boolean not null default false,
  completed_at date,
  created_at timestamptz not null default now()
);
create index if not exists member_milestones_user_created_idx on public.member_milestones(user_id, created_at desc);
alter table public.member_milestones enable row level security;
drop policy if exists "Members manage own milestones" on public.member_milestones;
create policy "Members manage own milestones" on public.member_milestones for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.member_milestones to authenticated;
