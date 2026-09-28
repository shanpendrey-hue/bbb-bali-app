-- B.B.B v70: run once in Supabase SQL Editor.
-- Adds private-ish guest profile storage for the app and ensures Bash Board realtime is published.

create table if not exists public.bbb_guest_profiles (
  guest_id text primary key,
  name text not null,
  profile_photo text default '',
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bbb_guest_profiles enable row level security;

drop policy if exists "Guests can create own profile" on public.bbb_guest_profiles;
create policy "Guests can create own profile" on public.bbb_guest_profiles for insert with check (true);

drop policy if exists "Guests can update profile" on public.bbb_guest_profiles;
create policy "Guests can update profile" on public.bbb_guest_profiles for update using (true) with check (true);

-- The browser app does not need public SELECT access to the guest list.
-- Shannon can export it later from Supabase Table Editor / CSV without exposing all guests in the app.

-- Ensure Bash Board changes are emitted through Supabase Realtime.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='bbb_bash_posts'
  ) then
    alter publication supabase_realtime add table public.bbb_bash_posts;
  end if;
end $$;
