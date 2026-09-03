-- RSVPs ("Estarei presente") for events — one row per member per event.
create table event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table event_attendees enable row level security;
create policy event_attendees_self_manage on event_attendees
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy event_attendees_admin_read_all on event_attendees
  for select using (is_admin());
