-- Made to Disappear: catalogue, notify, quotes, contact, orders.
-- Run with: npm run db:migrate

create table if not exists public.categories (
  slug text primary key,
  name text not null,
  short_name text,
  description text not null default '',
  status text not null default 'coming_soon' check (status in ('live', 'coming_soon')),
  line_drawing text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.certs (
  id text primary key,
  name text not null,
  certifier text not null,
  number text,
  pdf_url text,
  covered_skus text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  sku text primary key,
  category_slug text not null references public.categories(slug) on delete cascade,
  name text not null,
  size text not null default '',
  material text not null default '',
  unit_price numeric(10,4) not null,
  case_price numeric(10,2) not null,
  case_count int not null,
  pack_price numeric(10,2) not null,
  pack_count int not null,
  cert_id text references public.certs(id) on delete set null,
  images text[] not null default '{}',
  status text not null default 'live' check (status in ('live', 'coming_soon')),
  specs jsonb not null default '{}'::jsonb,
  goes_with text[] not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.notify (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  category_slug text not null,
  created_at timestamptz not null default now(),
  unique (email, category_slug)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null,
  phone text,
  volume_per_month text not null,
  categories text[] not null default '{}',
  delivery_address text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'paid',
  mode text not null default 'consumer',
  currency text not null default 'cad',
  amount_total int not null,
  items jsonb not null default '[]'::jsonb,
  shipping jsonb,
  created_at timestamptz not null default now()
);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_user_idx on public.orders (user_id);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Delivery',
  name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  province text not null default 'BC',
  postal_code text not null,
  created_at timestamptz not null default now()
);

-- Row level security: catalogue is public read; everything else is written
-- by the server (service role) and read only by its owner.
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.certs enable row level security;
alter table public.notify enable row level security;
alter table public.quotes enable row level security;
alter table public.contact_messages enable row level security;
alter table public.orders enable row level security;
alter table public.addresses enable row level security;

drop policy if exists "categories are public" on public.categories;
create policy "categories are public" on public.categories for select to anon, authenticated using (true);
drop policy if exists "products are public" on public.products;
create policy "products are public" on public.products for select to anon, authenticated using (true);
drop policy if exists "certs are public" on public.certs;
create policy "certs are public" on public.certs for select to anon, authenticated using (true);

drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders for select to authenticated
  using ((select auth.uid()) = user_id or lower(email) = lower((select auth.jwt() ->> 'email')));

drop policy if exists "own addresses select" on public.addresses;
create policy "own addresses select" on public.addresses for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "own addresses insert" on public.addresses;
create policy "own addresses insert" on public.addresses for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "own addresses delete" on public.addresses;
create policy "own addresses delete" on public.addresses for delete to authenticated
  using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.certs to anon, authenticated;
grant select on public.orders to authenticated;
grant select, insert, delete on public.addresses to authenticated;
