-- Consolidated database setup and security policies for Barber App.
-- Safe to run on a fresh database or on an existing one.

-- Staff users: owner and barber roles.
create table if not exists public.staff_users (
  id bigint generated always as identity primary key,
  username text not null unique,
  password_hash text not null,
  role text not null default 'barber',
  created_at timestamptz not null default now()
);

-- Barber catalog used by the public booking flow and the owner dashboard.
create table if not exists public.barbers (
  id bigint generated always as identity primary key,
  name text not null,
  service_price numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Bookings created by customers and managed from the dashboard.
create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  barber_id bigint not null references public.barbers(id) on delete cascade,
  appointment_time timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  reminder_enabled boolean not null default true,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Slot overrides used by the admin/owner to add or remove daily slots.
create table if not exists public.slot_overrides (
  id bigint generated always as identity primary key,
  slot_date date not null,
  slot_time text not null,
  is_available boolean not null,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

-- Backward-compatible migrations for existing databases.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'staff_users'
  ) then
    alter table public.staff_users
      add column if not exists role text not null default 'barber';

    update public.staff_users
    set role = 'barber'
    where role is null;

    if not exists (
      select 1
      from pg_constraint
      where conname = 'staff_users_role_check'
    ) then
      alter table public.staff_users
        add constraint staff_users_role_check check (role in ('owner', 'barber'));
    end if;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'bookings'
  ) then
    alter table public.bookings
      add column if not exists barber_id bigint;

    alter table public.bookings
      add column if not exists appointment_time timestamptz;

    alter table public.bookings
      add column if not exists customer_name text;

    alter table public.bookings
      add column if not exists customer_phone text;

    alter table public.bookings
      add column if not exists reminder_enabled boolean default true;

    alter table public.bookings
      add column if not exists status text default 'confirmed';

    alter table public.bookings
      add column if not exists created_at timestamptz default now();

    update public.bookings
    set reminder_enabled = true
    where reminder_enabled is null;

    update public.bookings
    set status = 'confirmed'
    where status is null;

    if not exists (
      select 1
      from pg_constraint
      where conname = 'bookings_status_check'
    ) then
      alter table public.bookings
        add constraint bookings_status_check check (status in ('confirmed', 'cancelled'));
    end if;

    if not exists (
      select 1
      from pg_constraint
      where conname = 'bookings_barber_id_fkey'
    ) then
      alter table public.bookings
        add constraint bookings_barber_id_fkey foreign key (barber_id) references public.barbers(id) on delete cascade;
    end if;
  end if;
end $$;

-- Enable RLS where needed.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'staff_users'
  ) then
    alter table public.staff_users enable row level security;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'slot_overrides'
  ) then
    alter table public.slot_overrides enable row level security;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'barbers'
  ) then
    alter table public.barbers disable row level security;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'bookings'
  ) then
    alter table public.bookings disable row level security;
  end if;
end $$;

-- Public read for slot overrides (availability computation), server-only writes.
drop policy if exists "slot_overrides_select_public" on public.slot_overrides;
create policy "slot_overrides_select_public"
on public.slot_overrides
for select
to anon, authenticated
using (true);

-- No public access to staff users. Service role bypasses RLS automatically.
drop policy if exists "staff_users_no_public_access" on public.staff_users;
create policy "staff_users_no_public_access"
on public.staff_users
for all
to anon, authenticated
using (false)
with check (false);
