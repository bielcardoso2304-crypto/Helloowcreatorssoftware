-- Community events, created only by Helloow admins and visible to every
-- authenticated member (creators and brands alike) in the "Eventos" tab.
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  event_date date not null,
  event_time time,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

-- Full read access for any logged-in member — not just admins.
create policy events_read_all on events
  for select using (auth.uid() is not null);

-- Only admins can create, edit, or delete events.
create policy events_admin_manage on events
  for all using (is_admin()) with check (is_admin());
