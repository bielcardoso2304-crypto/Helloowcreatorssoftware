-- Lets a creator "connect" with other creators (one-directional, like a
-- follow list). This is what powers the Network tab: it only shows the
-- creators you've connected with, while the Início tab keeps showing the
-- whole ecosystem.
create table connections (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  connected_creator_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (creator_id, connected_creator_id),
  check (creator_id <> connected_creator_id)
);

create index connections_creator_id_idx on connections (creator_id);

alter table connections enable row level security;

-- A creator can only see/create/delete their own outgoing connections —
-- there's no way to see who has connected with *you* in this version.
create policy connections_owner_manage on connections
  for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());
