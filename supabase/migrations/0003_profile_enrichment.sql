-- Enriches the creator profile: photo, stage name, bio, full social links,
-- preferred contact method, and commercial info.

alter table creators
  add column avatar_url text,
  add column stage_name text,
  add column bio text,
  add column instagram_url text,
  add column tiktok_url text,
  add column youtube_url text,
  add column other_platform_name text,
  add column other_url text,
  add column preferred_contact text
    check (preferred_contact in ('whatsapp', 'email', 'instagram')),
  add column commercial_info text;

-- ---------------------------------------------------------------------
-- Storage bucket for profile photos
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view avatars (they're shown on public-facing profile cards).
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- A creator can only upload/replace/delete a file inside a folder named
-- after their own user id (path convention: `${user_id}/avatar.<ext>`).
create policy "avatars_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
