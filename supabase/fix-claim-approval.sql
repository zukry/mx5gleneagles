-- Fix ownership-claim approval workflow.
-- Run this after extracting the updated ZIP.

create table if not exists public.car_owners (
  id bigint generated always as identity primary key,
  car_id bigint references public.cars(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner',
  current_owner boolean default true,
  approved boolean default false,
  claimed_at timestamptz default now(),
  unique(car_id, user_id)
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

drop policy if exists "Admins can read all car owner links" on public.car_owners;
create policy "Admins can read all car owner links"
on public.car_owners
for select
to authenticated
using (auth.uid() in (select user_id from public.admin_users));

drop policy if exists "Admins can insert car owner links" on public.car_owners;
create policy "Admins can insert car owner links"
on public.car_owners
for insert
to authenticated
with check (auth.uid() in (select user_id from public.admin_users));

drop policy if exists "Admins can update car owner links" on public.car_owners;
create policy "Admins can update car owner links"
on public.car_owners
for update
to authenticated
using (auth.uid() in (select user_id from public.admin_users))
with check (auth.uid() in (select user_id from public.admin_users));

grant update on public.cars to authenticated;

drop policy if exists "Admins can update cars" on public.cars;
create policy "Admins can update cars"
on public.cars
for update
to authenticated
using (auth.uid() in (select user_id from public.admin_users))
with check (auth.uid() in (select user_id from public.admin_users));

alter table public.ownership_claims add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.ownership_claims add column if not exists submitted_by uuid references auth.users(id) on delete cascade;
alter table public.ownership_claims add column if not exists submitted_email text;
alter table public.ownership_claims add column if not exists claimant_email text;
alter table public.ownership_claims add column if not exists claim_notes text;
alter table public.ownership_claims add column if not exists admin_notes text;
alter table public.ownership_claims add column if not exists reviewed_at timestamptz;
alter table public.ownership_claims add column if not exists reviewed_by uuid references auth.users(id);

grant select, insert, update on public.ownership_claims to authenticated;

drop policy if exists "Admins can update ownership claims" on public.ownership_claims;
create policy "Admins can update ownership claims"
on public.ownership_claims
for update
to authenticated
using (auth.uid() in (select user_id from public.admin_users))
with check (auth.uid() in (select user_id from public.admin_users));

notify pgrst, 'reload schema';
