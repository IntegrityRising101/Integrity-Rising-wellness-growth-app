-- Private profile-photo storage for Integrity Rising community members.
-- Photos are limited to 2 MB and common web image formats.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-avatars',
  'member-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

alter table public.profiles
  add column if not exists avatar_path text;

drop policy if exists "Signed-in members can view member avatars" on storage.objects;
create policy "Signed-in members can view member avatars"
on storage.objects for select
to authenticated
using (bucket_id = 'member-avatars');

drop policy if exists "Members upload their own avatar" on storage.objects;
create policy "Members upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'member-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Members update their own avatar" on storage.objects;
create policy "Members update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'member-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'member-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Members delete their own avatar" on storage.objects;
create policy "Members delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'member-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
