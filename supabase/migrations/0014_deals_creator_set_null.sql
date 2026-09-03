-- Deleting a creator's account used to cascade-delete their deals too,
-- silently shrinking the admin dashboard's revenue/profit totals — but a
-- deal already happened and already hit the company's cash flow, so it
-- must survive the creator's account being removed. The UI already shows
-- "Criador removido" for a deal whose creator_id doesn't resolve (see
-- getDeals() in lib/get-deals.ts), so this only needed a schema change.
alter table deals drop constraint deals_creator_id_fkey;
alter table deals alter column creator_id drop not null;
alter table deals add constraint deals_creator_id_fkey
  foreign key (creator_id) references auth.users (id) on delete set null;
