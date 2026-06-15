-- Ownership claim workflow for MX5 Gleneagles Registry
-- Run this in Supabase SQL Editor.

create table if not exists ownership_claims (
  id bigint generated always as identity primary key,
  car_id bigint references public.cars(id) on delete cascade not null,
  submitted_by uuid references auth.users(id) on delete cascade not null,
  submitted_email text,
  claim_notes text,
  status text default 'pending' not null,
  admin_notes text,
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table ownership_claims add column if not exists submitted_email text;
alter table ownership_claims add column if not exists admin_notes text;
alter table ownership_claims add column if not exists reviewed_at timestamptz;
alter table ownership_claims add column if not exists reviewed_by uuid references auth.users(id);

alter table ownership_claims enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.ownership_claims to authenticated;
grant update on public.ownership_claims to authenticated;
grant usage, select on sequence ownership_claims_id_seq to authenticated;

-- Users can submit and read their own claims.
drop policy if exists "Users can create ownership claims" on public.ownership_claims;
create policy "Users can create ownership claims"
on public.ownership_claims
for insert
to authenticated
with check (auth.uid() = submitted_by);

drop policy if exists "Users can read own ownership claims" on public.ownership_claims;
create policy "Users can read own ownership claims"
on public.ownership_claims
for select
to authenticated
using (auth.uid() = submitted_by);

-- Admins can read and review all claims.
drop policy if exists "Admins can read all ownership claims" on public.ownership_claims;
create policy "Admins can read all ownership claims"
on public.ownership_claims
for select
to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can update ownership claims" on public.ownership_claims;
create policy "Admins can update ownership claims"
on public.ownership_claims
for update
to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

-- Make sure admin table itself exists.
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;
grant select on public.admin_users to authenticated;

drop policy if exists "Users can read own admin row" on public.admin_users;
create policy "Users can read own admin row"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);
