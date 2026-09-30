-- supabase/admin-schema.sql
--
-- Run this once in the Supabase SQL editor (or via `supabase db execute`)
-- to enable the admin orders dashboard. It:
--   1. creates an `admins` allowlist table (one row per admin user),
--   2. enables RLS on `orders` / `order_status_history` and adds
--      admin-only policies so those tables are unreadable/unwritable by
--      anyone else through PostgREST or supabase-js (defense in depth —
--      the edge functions below also check this table explicitly).
--
-- After running this, create the admin's login in Supabase Dashboard >
-- Authentication > Users (email + password), copy their User UID, then:
--   insert into admins (user_id, email) values ('<uid>', 'admin@example.com');

create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
alter table order_status_history enable row level security;

drop policy if exists "Admins can view orders" on orders;
create policy "Admins can view orders" on orders
  for select
  using (exists (select 1 from admins where admins.user_id = auth.uid()));

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders" on orders
  for update
  using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

drop policy if exists "Admins can view order status history" on order_status_history;
create policy "Admins can view order status history" on order_status_history
  for select
  using (exists (select 1 from admins where admins.user_id = auth.uid()));

-- NOTE: create-order/quote connect via `postgres` npm driver using
-- DATABASE_URL (a direct Postgres connection, not PostgREST), which
-- connects as a role that bypasses RLS, so enabling RLS here does not
-- affect order creation.
