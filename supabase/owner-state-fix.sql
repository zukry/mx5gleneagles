-- Owner-state and claim duplicate fix
-- Run in Supabase SQL Editor before testing this package.

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;
grant select on public.admin_users to authenticated;

drop policy if exists "Users can read admin_users" on public.admin_users;
create policy "Users can read admin_users"
on public.admin_users
for select
to authenticated
using (true);

alter table public.ownership_claims
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.ownership_claims
add column if not exists submitted_by uuid references auth.users(id) on delete cascade;

alter table public.ownership_claims
add column if not exists submitted_email text;

alter table public.ownership_claims
add column if not exists claimant_email text;

alter table public.ownership_claims
add column if not exists claim_notes text;

alter table public.ownership_claims
add column if not exists status text default 'pending';

alter table public.ownership_claims
add column if not exists admin_notes text;

alter table public.ownership_claims
add column if not exists reviewed_at timestamptz;

alter table public.ownership_claims
add column if not exists reviewed_by uuid references auth.users(id);

alter table public.ownership_claims alter column submitted_by drop not null;
alter table public.ownership_claims alter column user_id drop not null;
alter table public.ownership_claims alter column submitted_email drop not null;
alter table public.ownership_claims alter column claimant_email drop not null;
alter table public.ownership_claims alter column claim_notes drop not null;
alter table public.ownership_claims alter column status set default 'pending';

-- Fill user_id where older claims only used submitted_by.
update public.ownership_claims
set user_id = submitted_by
where user_id is null
and submitted_by is not null;

-- Remove duplicate pending ownership claims, keeping the newest claim per car/user.
delete from public.ownership_claims a
using public.ownership_claims b
where a.id < b.id
and a.car_id = b.car_id
and coalesce(a.submitted_by, a.user_id) = coalesce(b.submitted_by, b.user_id)
and a.status = 'pending'
and b.status = 'pending';

-- Prevent future duplicate pending claims from the same user for the same car.
create unique index if not exists one_pending_claim_per_user_per_car
on public.ownership_claims (
  car_id,
  coalesce(submitted_by, user_id)
)
where status = 'pending';

alter table public.ownership_claims enable row level security;
grant select, insert, update on public.ownership_claims to authenticated;
grant usage on sequence public.ownership_claims_id_seq to authenticated;

drop policy if exists "Users can create ownership claims" on public.ownership_claims;
create policy "Users can create ownership claims"
on public.ownership_claims
for insert
to authenticated
with check (
  auth.uid() = submitted_by
  or auth.uid() = user_id
);

drop policy if exists "Users can view their own claims" on public.ownership_claims;
create policy "Users can view their own claims"
on public.ownership_claims
for select
to authenticated
using (
  auth.uid() = submitted_by
  or auth.uid() = user_id
);

drop policy if exists "Admins can read ownership claims" on public.ownership_claims;
drop policy if exists "Admins can read all ownership claims" on public.ownership_claims;
create policy "Admins can read all ownership claims"
on public.ownership_claims
for select
to authenticated
using (
  auth.uid() in (select user_id from public.admin_users)
);

drop policy if exists "Admins can update ownership claims" on public.ownership_claims;
drop policy if exists "Admins can update all ownership claims" on public.ownership_claims;
create policy "Admins can update ownership claims"
on public.ownership_claims
for update
to authenticated
using (
  auth.uid() in (select user_id from public.admin_users)
)
with check (
  auth.uid() in (select user_id from public.admin_users)
);

-- Owner links: allow users to read their own link and admins to create/update links on approval.
create table if not exists public.car_owners (
  id bigint generated always as identity primary key,
  car_id bigint references public.cars(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner',
  current_owner boolean default true,
  approved boolean default false,
  claimed_at timestamptz default now(),
  unique (car_id, user_id)
);

alter table public.car_owners enable row level security;
grant select, insert, update on public.car_owners to authenticated;
grant usage on sequence public.car_owners_id_seq to authenticated;

drop policy if exists "Users can read own car owner links" on public.car_owners;
create policy "Users can read own car owner links"
on public.car_owners
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can insert car owner links" on public.car_owners;
create policy "Admins can insert car owner links"
on public.car_owners
for insert
to authenticated
with check (
  auth.uid() in (select user_id from public.admin_users)
);

drop policy if exists "Admins can update car owner links" on public.car_owners;
create policy "Admins can update car owner links"
on public.car_owners
for update
to authenticated
using (
  auth.uid() in (select user_id from public.admin_users)
)
with check (
  auth.uid() in (select user_id from public.admin_users)
);

-- Admin approval also marks cars as claimed.
grant update on public.cars to authenticated;

drop policy if exists "Admins can update cars" on public.cars;
create policy "Admins can update cars"
on public.cars
for update
to authenticated
using (
  auth.uid() in (select user_id from public.admin_users)
)
with check (
  auth.uid() in (select user_id from public.admin_users)
);

notify pgrst, 'reload schema';
