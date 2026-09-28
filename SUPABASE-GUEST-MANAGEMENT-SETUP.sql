-- B.B.B Guest Management - Supabase setup
-- Run this ONCE in Supabase > SQL Editor.
-- This stores guest/profile, Made Driver, massage and Pizza Party data.
-- The browser can create/update records, but cannot read the full guest list.

create table if not exists public.bbb_guest_management (
  guest_id text primary key,
  name text not null,
  signed_up timestamptz,
  updated_at timestamptz not null default now(),
  flight_details jsonb not null default '{}'::jsonb,
  profile_data jsonb not null default '{}'::jsonb
);

create table if not exists public.bbb_made_driver (
  booking_id text primary key,
  guest_id text not null,
  guest_name text not null,
  status text not null default 'booked',
  destination text default '',
  transfer_price_aud numeric default 0,
  drinks jsonb not null default '[]'::jsonb,
  drinks_total_aud numeric default 0,
  total_aud numeric default 0,
  flight_details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.bbb_massage_bookings (
  booking_id text primary key,
  guest_id text not null,
  guest_name text not null,
  status text not null default 'booked',
  massage text default '',
  quantity integer not null default 1,
  booking_date text default '',
  booking_time text default '',
  duration_mins integer default 0,
  price_idr numeric default 0,
  total_idr numeric default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.bbb_pizza_party (
  booking_id text primary key,
  guest_id text not null,
  guest_name text not null,
  status text not null default 'booked',
  option_name text default 'Bali Pizza Party',
  quantity integer not null default 1,
  price_each_idr numeric default 0,
  total_idr numeric default 0,
  payment_status text not null default 'Unpaid',
  amount_paid_idr numeric default 0,
  updated_at timestamptz not null default now()
);

alter table public.bbb_guest_management enable row level security;
alter table public.bbb_made_driver enable row level security;
alter table public.bbb_massage_bookings enable row level security;
alter table public.bbb_pizza_party enable row level security;

-- No SELECT policies: guests cannot download the guest list from the browser.
-- Shannon can view/edit everything securely in the Supabase Table Editor.

do $$
declare t text;
begin
  foreach t in array array['bbb_guest_management','bbb_made_driver','bbb_massage_bookings','bbb_pizza_party'] loop
    execute format('drop policy if exists "BBB guest insert" on public.%I',t);
    execute format('drop policy if exists "BBB guest update" on public.%I',t);
    execute format('create policy "BBB guest insert" on public.%I for insert with check (true)',t);
    execute format('create policy "BBB guest update" on public.%I for update using (true) with check (true)',t);
  end loop;
end $$;
