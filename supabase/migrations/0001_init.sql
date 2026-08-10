-- Helloow Creators — initial schema and RLS.
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create table creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  whatsapp text not null,
  city_state text not null,
  niche text,
  main_platform text not null
    check (main_platform in ('instagram', 'tiktok', 'youtube', 'other')),
  instagram_handle text,
  instagram_followers int check (instagram_followers >= 0),
  tiktok_handle text,
  tiktok_followers int check (tiktok_followers >= 0),
  youtube_handle text,
  youtube_followers int check (youtube_followers >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Members of this table can read every row in `creators` — this is what
-- powers the internal "how many creators do we have" panel. There is no
-- app-facing way to insert into it: a Helloow team member becomes admin
-- only by having a row added here directly in the Supabase dashboard/SQL
-- editor, after they've signed up through the app.
create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger creators_set_updated_at before update on creators
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table creators enable row level security;
alter table admins enable row level security;

-- Every authenticated user can manage their own creator row.
create policy creators_self_manage on creators
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- `admins` has no policies at all — normal (anon/authenticated) requests
-- can never read or write it. Only is_admin() below, running as a
-- SECURITY DEFINER function owned by a role with BYPASSRLS (the default
-- for functions created via the SQL editor), can see it. Querying a
-- separate table here (instead of a self-referential check on
-- `creators`) avoids infinite-recursion in the creators SELECT policy.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create policy creators_admin_read_all on creators
  for select using (is_admin());

-- Lets the app call is_admin() directly (e.g. to decide where to route a
-- user after login) instead of only relying on it inside the policy above.
grant execute on function is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- Promoting a Helloow team member to admin (run manually per person,
-- after they've signed up through the app so their auth.users row exists):
--
--   insert into admins (user_id)
--   select id from auth.users where email = 'someone@helloow.com';
-- ---------------------------------------------------------------------
