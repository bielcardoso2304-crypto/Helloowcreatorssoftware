-- Brand accounts: the platform now serves two kinds of members — creators
-- (existing `creators` table) and brands that want to find/hire creators.
-- Mirrors the `creators` table's shape and RLS pattern (self-manage own
-- row, admin reads all) rather than reusing `creators`, since the fields
-- are different (a company, not a person) and creators must never end up
-- with a brand row or vice versa.
create table brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  avatar_url text,
  company_name text not null,
  contact_name text not null,
  email text not null,
  whatsapp text not null,
  city_state text not null,
  segment text,
  bio text,
  website_url text,
  instagram_handle text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger brand_profiles_set_updated_at before update on brand_profiles
  for each row execute function set_updated_at();

alter table brand_profiles enable row level security;

create policy brand_profiles_self_manage on brand_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy brand_profiles_admin_read_all on brand_profiles
  for select using (is_admin());

-- Public-safe subset for the "Início" directory (same privacy boundary as
-- creators_directory in 0004: no email/whatsapp for other members to see).
create view brand_profiles_directory as
select id, user_id, avatar_url, company_name, bio, city_state, segment,
  website_url, instagram_handle, instagram_url, created_at
from brand_profiles;

grant select on brand_profiles_directory to authenticated;
