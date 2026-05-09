create extension if not exists pgcrypto;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.guestbook_entries enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on table public.guestbook_entries to anon, authenticated;

drop policy if exists "Public can read guestbook entries" on public.guestbook_entries;
create policy "Public can read guestbook entries"
on public.guestbook_entries
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert guestbook entries" on public.guestbook_entries;
create policy "Public can insert guestbook entries"
on public.guestbook_entries
for insert
to anon, authenticated
with check (true);
