-- MX5 Gleneagles Registry Supabase schema
-- Run this once in Supabase SQL Editor on a fresh project.

create table if not exists cars (
  id bigint generated always as identity primary key,
  registry_id text unique not null,
  slug text unique not null,
  registration text,
  registration_visibility text default 'public' not null,
  partial_vin text,
  colour text,
  interior text,
  country text,
  status text,
  owner_count integer,
  current_owner_since integer,
  ownership_status text default 'unclaimed',
  entry_type text default 'registry research',
  summary text,
  data_confidence text,
  originality_rating text,
  photo_count integer default 0,
  document_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by text
);

create table if not exists registrations (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  registration text not null,
  start_year integer,
  end_year integer,
  current_registration boolean default false,
  sort_order integer default 0,
  notes text
);

create table if not exists originality_items (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  category text not null,
  item_name text not null,
  status text not null,
  notes text
);

create table if not exists change_log (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  change_date timestamptz default now(),
  updated_by text,
  change_text text not null
);

create table if not exists sources (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  source_type text,
  source_name text,
  source_url text,
  source_date date,
  notes text,
  public boolean default true
);

create table if not exists photos (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  image_url text not null,
  caption text,
  public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists documents (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  name text not null,
  document_url text,
  public boolean default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists car_owners (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner',
  current_owner boolean default true,
  approved boolean default false,
  claimed_at timestamptz default now(),
  unique (car_id, user_id)
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists change_requests (
  id bigint generated always as identity primary key,
  car_id bigint references cars(id) on delete cascade not null,
  submitted_by uuid references auth.users(id) on delete cascade not null,
  request_type text not null default 'car_update',
  status text not null default 'pending',
  proposed_changes jsonb not null,
  admin_notes text,
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table cars enable row level security;
alter table registrations enable row level security;
alter table originality_items enable row level security;
alter table change_log enable row level security;
alter table sources enable row level security;
alter table photos enable row level security;
alter table documents enable row level security;
alter table car_owners enable row level security;
alter table admin_users enable row level security;
alter table change_requests enable row level security;

create policy "Public read cars" on cars for select to anon, authenticated using (true);
create policy "Public read registrations" on registrations for select to anon, authenticated using (true);
create policy "Public read originality items" on originality_items for select to anon, authenticated using (true);
create policy "Public read change log" on change_log for select to anon, authenticated using (true);
create policy "Public read public sources" on sources for select to anon, authenticated using (public = true);
create policy "Public read public photos" on photos for select to anon, authenticated using (public = true);
create policy "Public read public documents" on documents for select to anon, authenticated using (public = true);

create policy "Users can read their own ownership links" on car_owners for select to authenticated using (auth.uid() = user_id);
create policy "Users can request ownership claim" on car_owners for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins can read all ownership links" on car_owners for select to authenticated using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));
create policy "Admins can update ownership links" on car_owners for update to authenticated using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));

create policy "Users can read own admin row" on admin_users for select to authenticated using (auth.uid() = user_id);

create policy "Users can create their own change requests" on change_requests for insert to authenticated with check (auth.uid() = submitted_by);
create policy "Users can read their own change requests" on change_requests for select to authenticated using (auth.uid() = submitted_by);
create policy "Admins can read all change requests" on change_requests for select to authenticated using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));
create policy "Admins can update change requests" on change_requests for update to authenticated using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));

insert into cars (
  registry_id, slug, registration, registration_visibility, partial_vin, colour, interior, country,
  status, owner_count, current_owner_since, ownership_status, entry_type, summary, data_confidence,
  originality_rating, photo_count, document_count, updated_by
)
values (
  'GE-001', 'ge-001', 'N9 OWO', 'public', 'JMZNA18P200301***', 'Montego Blue Mica',
  'Champagne leather / tartan', 'United Kingdom', 'Under restoration', 3, 2025,
  'claimed', 'owner supplied',
  'A UK Mazda MX-5 Gleneagles currently undergoing a major preservation-focused restoration.',
  'High', 'Exceptional', 0, 0, 'Registry administrator'
)
on conflict (registry_id) do nothing;

insert into registrations (car_id, registration, start_year, end_year, current_registration, sort_order, notes)
select cars.id, reg.registration, reg.start_year, reg.end_year, reg.current_registration, reg.sort_order, reg.notes
from cars
cross join (
  values
    ('N131 FHE', 1996, null, false, 1, 'Original registration. Exact date removed before N2 EAC currently unknown.'),
    ('N2 EAC', null, 2017, false, 2, 'Private/interim registration. Vehicle history report confirms plate changed from N2 EAC to N131 FHE in 12/2017.'),
    ('N131 FHE', 2017, 2026, false, 3, 'Original registration restored in 12/2017.'),
    ('N9 OWO', 2026, null, true, 4, 'Current private registration.')
) as reg(registration, start_year, end_year, current_registration, sort_order, notes)
where cars.registry_id = 'GE-001'
and not exists (select 1 from registrations where registrations.car_id = cars.id);

insert into originality_items (car_id, category, item_name, status, notes)
select cars.id, item.category, item.item_name, item.status, item.notes
from cars
cross join (
  values
    ('Interior', 'Original champagne leather seats', 'Present', null),
    ('Interior', 'Original champagne left door card', 'Present', null),
    ('Interior', 'Original champagne right door card', 'Present', null),
    ('Interior', 'Original champagne dashboard trim', 'Present', null),
    ('Wood Effect Trim', 'Original wood effect centre console', 'Present', null),
    ('Wood Effect Trim', 'Original wood effect tombstone', 'Present', null),
    ('Steering', 'Original Nardi steering wheel', 'Present', null),
    ('Gaiters', 'Original tartan gear gaiter', 'Present', null),
    ('Accessories', 'Original tartan document wallet', 'Present', null),
    ('Accessories', 'Original tartan key wallet', 'Present', null),
    ('Accessories', 'Original tartan cap set', 'Present', null),
    ('Accessories', 'Original tonneau cover', 'Present', null),
    ('Accessories', 'Original wind blocker', 'Present', null),
    ('Audio', 'Original Clarion DRX8175R stereo', 'Present', null),
    ('Exterior', 'Original Montego Blue Mica paint', 'Refurbished', 'Full respray/restoration'),
    ('Exterior', 'Original 15 inch 5 spoke alloy wheels', 'Present', null),
    ('Exterior', 'Original wheel centre caps', 'Unknown', null),
    ('Badging', 'Original left-hand Gleneagles side badge', 'Present', null),
    ('Badging', 'Original right-hand Gleneagles side badge', 'Present', null),
    ('Documentation', 'Original owner''s handbook', 'Present', null),
    ('Documentation', 'Original service book', 'Missing', null),
    ('Documentation', 'Original sales invoice', 'Missing', null),
    ('Documentation', 'Original Gleneagles brochure', 'Present', null),
    ('Keys', 'Original Mazda key', 'Present', null),
    ('Factory Options', 'Factory air conditioning', 'Missing', 'Car does not have air conditioning'),
    ('Factory Options', 'Factory hardtop', 'Missing', 'Car has TWR hardtop, not OEM Gleneagles hardtop'),
    ('Provenance', 'Original supplying dealer known', 'Unknown', null),
    ('Provenance', 'First registration known', 'Present', null),
    ('Provenance', 'Complete registration history known', 'Present', null),
    ('Provenance', 'Complete ownership history known', 'Present', null)
) as item(category, item_name, status, notes)
where cars.registry_id = 'GE-001'
and not exists (select 1 from originality_items where originality_items.car_id = cars.id);

insert into change_log (car_id, updated_by, change_text)
select cars.id, 'Registry administrator', log.change_text
from cars
cross join (
  values
    ('Created registry entry GE-001'),
    ('Added current registration N9 OWO'),
    ('Added known registration chain including original N131 FHE'),
    ('Added partial VIN'),
    ('Added initial Gleneagles-specific originality checklist'),
    ('Added restoration status'),
    ('Added owner count and metadata fields')
) as log(change_text)
where cars.registry_id = 'GE-001'
and not exists (select 1 from change_log where change_log.car_id = cars.id);

insert into sources (car_id, source_type, source_name, source_date, notes, public)
select cars.id, 'owner supplied', 'Registry administrator', current_date, 'Initial owner-supplied registry record.', true
from cars
where cars.registry_id = 'GE-001'
and not exists (select 1 from sources where sources.car_id = cars.id);

-- After creating your account through the website, run this with your auth user ID:
-- insert into admin_users (user_id) values ('YOUR-AUTH-USER-ID-HERE');
