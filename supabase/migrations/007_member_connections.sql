-- Private member-to-member connection requests for the Integrity Rising community.
create table if not exists public.member_connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint member_connections_not_self check (requester_id <> recipient_id)
);

create unique index if not exists member_connections_one_pair
on public.member_connections (
  least(requester_id, recipient_id),
  greatest(requester_id, recipient_id)
);

create index if not exists member_connections_requester_idx
on public.member_connections (requester_id);
create index if not exists member_connections_recipient_idx
on public.member_connections (recipient_id);

alter table public.member_connections enable row level security;

drop policy if exists "Members can view their own connection requests" on public.member_connections;
create policy "Members can view their own connection requests"
on public.member_connections for select
to authenticated
using (auth.uid() = requester_id or auth.uid() = recipient_id);

drop policy if exists "Members can send connection requests" on public.member_connections;
create policy "Members can send connection requests"
on public.member_connections for insert
to authenticated
with check (
  auth.uid() = requester_id
  and requester_id <> recipient_id
  and status = 'pending'
);

drop policy if exists "Recipients can respond to connection requests" on public.member_connections;
create policy "Recipients can respond to connection requests"
on public.member_connections for update
to authenticated
using (auth.uid() = recipient_id and status = 'pending')
with check (
  auth.uid() = recipient_id
  and status in ('accepted', 'declined')
);

drop policy if exists "Members can remove their own connection requests" on public.member_connections;
create policy "Members can remove their own connection requests"
on public.member_connections for delete
to authenticated
using (auth.uid() = requester_id or auth.uid() = recipient_id);

create or replace function public.set_member_connections_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.requester_id <> old.requester_id or new.recipient_id <> old.recipient_id then
    raise exception 'Connection participants cannot be changed';
  end if;
  if old.status <> 'pending' or new.status not in ('accepted', 'declined') then
    raise exception 'Only pending requests can be accepted or declined';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists member_connections_set_updated_at on public.member_connections;
create trigger member_connections_set_updated_at
before update on public.member_connections
for each row execute function public.set_member_connections_updated_at();
