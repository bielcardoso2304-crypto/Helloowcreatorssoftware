-- Business deals closed between a creator and a brand, registered
-- manually by a Helloow admin. `company_earning` is always the
-- commission % applied to the deal value — never entered by hand, so it
-- can never drift out of sync with the other two columns.
create table deals (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  brand_name text not null,
  deal_value numeric(12,2) not null check (deal_value >= 0),
  commission_pct numeric(5,2) not null
    check (commission_pct >= 0 and commission_pct <= 100),
  company_earning numeric(12,2)
    generated always as (round(deal_value * commission_pct / 100, 2)) stored,
  deal_date date not null,
  created_at timestamptz not null default now()
);

alter table deals enable row level security;

-- Deal values and commissions are sensitive financial data — only
-- Helloow admins (is_admin(), see 0001) can read or write this table.
-- Creators have no self-service access to it.
create policy deals_admin_manage on deals
  for all using (is_admin()) with check (is_admin());
