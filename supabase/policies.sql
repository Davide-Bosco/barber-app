-- Tables
create table if not exists public.staff_users (
  id bigint generated always as identity primary key,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.slot_overrides (
  id bigint generated always as identity primary key,
  slot_date date not null,
  slot_time text not null,
  is_available boolean not null,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

-- Enable RLS
alter table public.staff_users enable row level security;
alter table public.slot_overrides enable row level security;

-- slot_overrides: public read (used to compute availability), write only from server service role
drop policy if exists "slot_overrides_select_public" on public.slot_overrides;
create policy "slot_overrides_select_public"
on public.slot_overrides
for select
to anon, authenticated
using (true);

-- staff_users: no anon/authenticated access (service_role bypasses RLS automatically)
drop policy if exists "staff_users_no_public_access" on public.staff_users;
create policy "staff_users_no_public_access"
on public.staff_users
for all
to anon, authenticated
using (false)
with check (false);
