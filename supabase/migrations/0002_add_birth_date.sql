-- Adds date of birth to the creator profile.
alter table creators
  add column birth_date date not null default '2000-01-01';

-- Drop the default now that existing rows (if any) have been backfilled —
-- new rows must supply a real birth_date going forward.
alter table creators
  alter column birth_date drop default;
