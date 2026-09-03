-- Brands are now a managed list (like creators), not free text on each
-- deal — lets the admin pick an existing brand from a dropdown instead of
-- retyping (and misspelling) it every time.
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table brands enable row level security;

create policy brands_admin_manage on brands
  for all using (is_admin()) with check (is_admin());

-- Backfill: turn every distinct brand_name already on `deals` into a row
-- here, then point each deal at it, before dropping the old text column.
insert into brands (name)
select distinct brand_name from deals
where brand_name is not null
on conflict (name) do nothing;

alter table deals add column brand_id uuid references brands (id);

update deals set brand_id = brands.id
from brands
where brands.name = deals.brand_name;

alter table deals alter column brand_id set not null;
alter table deals drop column brand_name;
