-- Run this in the Supabase SQL editor when setting up or updating the site schema.
-- ==============================================================================
-- SHUDH LOHA DATABASE SCHEMA & STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- NOTE: Replace [[ADMIN EMAIL]] with your verified admin email address.
-- ==============================================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Sarbloh',
  description text not null default 'Pure iron and hand-finished.',
  image_url text,
  image_urls jsonb not null default '[]'::jsonb,
  video_urls jsonb not null default '[]'::jsonb,
  size text,
  approx_weight text,
  price text,
  minimum_order text,
  payment_link text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists image_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists video_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists size text;
alter table public.products add column if not exists approx_weight text;
alter table public.products add column if not exists minimum_order text;
alter table public.products add column if not exists payment_link text;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('whatsapp', 'phone', 'form')),
  product_name text,
  name text,
  phone text,
  message text,
  page_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  referrer text,
  device text,
  created_at timestamptz not null default now()
);

create table if not exists public.visitor_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null unique,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.visitor_item_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.visitor_profiles(id) on delete cascade,
  product_name text not null,
  page_url text not null,
  viewed_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Featured update',
  title text not null,
  description text not null,
  cta_label text not null default 'Ask us',
  cta_url text not null default '#contact',
  image_url text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.offers add column if not exists image_url text;

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS across all tables
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.page_views enable row level security;
alter table public.visitor_profiles enable row level security;
alter table public.visitor_item_views enable row level security;
alter table public.offers enable row level security;
alter table public.product_reviews enable row level security;

-- Drop legacy open policies
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admin can manage products" on public.products;

drop policy if exists "Public can create leads" on public.leads;
drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Admin can read leads" on public.leads;
drop policy if exists "Admin can manage leads" on public.leads;

drop policy if exists "Public can create page views" on public.page_views;
drop policy if exists "Admins can read page views" on public.page_views;
drop policy if exists "Admin can read page views" on public.page_views;

drop policy if exists "Visitors can create own profile" on public.visitor_profiles;
drop policy if exists "Visitors can update own profile" on public.visitor_profiles;
drop policy if exists "Authenticated can read visitor profiles" on public.visitor_profiles;
drop policy if exists "Admin can read visitor profiles" on public.visitor_profiles;

drop policy if exists "Visitors can create own item views" on public.visitor_item_views;
drop policy if exists "Authenticated can read item views" on public.visitor_item_views;
drop policy if exists "Admin can read item views" on public.visitor_item_views;

drop policy if exists "Public can view active offers" on public.offers;
drop policy if exists "Admins can manage offers" on public.offers;
drop policy if exists "Admin can manage offers" on public.offers;

drop policy if exists "Public can view approved product reviews" on public.product_reviews;
drop policy if exists "Admin can manage product reviews" on public.product_reviews;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

-- ==============================================================================
-- STRICT ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- 1. PRODUCTS
-- Anonymous visitors may view active products only
create policy "Public can view active products" on public.products
  for select to anon, authenticated
  using (is_active = true);

-- ONLY the specified admin email can view all products and write/update/delete
create policy "Admin can manage products" on public.products
  for all to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'))
  with check (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- 2. LEADS
-- Anonymous visitors may insert leads only
create policy "Public can create leads" on public.leads
  for insert to anon
  with check (true);

-- ONLY the specified admin email can read leads
create policy "Admin can read leads" on public.leads
  for select to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- ONLY the specified admin email can update or delete leads
create policy "Admin can manage leads" on public.leads
  for all to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'))
  with check (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- 3. PAGE VIEWS
-- Anonymous and public visitors may ONLY record page views
create policy "Public can create page views" on public.page_views
  for insert
  with check (true);

-- ONLY the specified admin email can inspect analytics / page views
create policy "Admin can read page views" on public.page_views
  for select to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- 4. VISITOR PROFILES & ITEM VIEWS
create policy "Visitors can create own profile" on public.visitor_profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "Visitors can update own profile" on public.visitor_profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Admin can read visitor profiles" on public.visitor_profiles
  for select to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

create policy "Visitors can create own item views" on public.visitor_item_views
  for insert to authenticated with check (auth.uid() = visitor_id);

create policy "Admin can read item views" on public.visitor_item_views
  for select to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- 5. OFFERS
-- Public may ONLY view active promotional offers
create policy "Public can view active offers" on public.offers
  for select
  using (is_active = true);

-- ONLY the specified admin email can manage promotional offers
create policy "Admin can manage offers" on public.offers
  for all to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'))
  with check (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- Only approved customer reviews are visible publicly; admin controls review publishing.
create policy "Public can view approved product reviews" on public.product_reviews
  for select to anon, authenticated
  using (is_approved = true);

create policy "Admin can manage product reviews" on public.product_reviews
  for all to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'))
  with check (lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- ==============================================================================
-- STORAGE BUCKET & POLICIES
-- ==============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 104857600
where id = 'product-images';

-- Public can view images in product-images bucket
create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');

-- ONLY the specified admin email can upload, update, or delete product images
create policy "Admin can upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

create policy "Admin can update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

create policy "Admin can delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and lower(auth.jwt() ->> 'email') = lower('[[ADMIN EMAIL]]'));

-- ==============================================================================
-- SEED DATA (Normalized with optimized WebP assets)
-- ==============================================================================

update public.products
set category = 'Sarbloh'
where category = 'Iron Kitchenware';

update public.products
set is_active = false,
    updated_at = now()
where lower(trim(name)) = 'iron fork';

update public.products old_product
set name = 'Karchi / Chamcha (With Handle)',
    updated_at = now()
where lower(trim(old_product.name)) = 'iron spoon'
  and not exists (
    select 1
    from public.products existing
    where lower(trim(existing.name)) = 'karchi / chamcha (with handle)'
      and existing.id <> old_product.id
  );

insert into public.products (name, category, image_url, size, approx_weight, price, minimum_order, sort_order)
select catalogue.name, 'Sarbloh', catalogue.image_url, catalogue.size, catalogue.approx_weight,
       catalogue.price, catalogue.minimum_order, catalogue.sort_order
from (values
  ('Handi / Kadni', 'Assets/products/kadni-handi.webp', '6, 7, 8 muh', '3–8 kg', 'Price range on request', '10 kg', 1),
  ('Tadka Pan', 'Assets/products/tadka-pan.webp', '6–10 muh', '700 g–2 kg', 'Price range on request', '10 kg', 2),
  ('Big Deg', 'Assets/products/big-deg.webp', '14 inch and above', '7 kg and above', 'Price range on request', '10 kg', 3),
  ('Tutma Tawa', 'Assets/products/tutma-tawa.webp', '9, 10, 11 and other sizes', '1–2 kg', 'Price range on request', '10 kg', 4),
  ('Tikki Tawi / Roti Tawi', 'Assets/products/tawi.webp', '16–40 inch', '4 kg and above', 'Price range on request', '10 kg', 5),
  ('White Batta / Sarbloh Set', 'Assets/products/white-batta-set.webp', '6, 7, 8 and other sizes', '200 g–1 kg', 'Price range on request', '10 kg', 6),
  ('Batta / Sarbloh Set', 'Assets/products/sarbloh-batta.webp', '6, 7, 8 and other sizes', '200 g–1 kg', 'Price range on request', '10 kg', 7),
  ('Chotti Kadahi (13–14 gauge)', 'Assets/products/sarbloh-kadai.webp', '12–18 inch', '1.25–4 kg', 'Price range on request', '10 kg', 8),
  ('Chotti Deg / Donga', 'Assets/products/chotti-deg-dongi.webp', '6, 7, 8 muh', '3–8 kg', 'Price range on request', '10 kg', 9),
  ('Fry Pan', 'Assets/products/sarbloh-fry-pan.webp', '9, 10, 11, 12 inch', '1–2 kg', 'Price range on request', '10 kg', 10),
  ('Tadka Fry Pan', 'Assets/products/tadka-fry-pan.webp', '6–10 muh', '700 g–2 kg', 'Price range on request', '10 kg', 11),
  ('Karchi / Chamcha (Without Handle)', 'Assets/products/karchi-without-handle.webp', '9, 10, 11, 12 inch', '1–2 kg', 'Price range on request', '10 kg', 12),
  ('Karchi / Chamcha (With Handle)', 'Assets/products/chamcha-with-handle.webp', '15–24 inch', '500 g–2 kg', 'Price range on request', '10 kg', 13),
  ('Iron Plain Tawa', 'Assets/products/plane-tawa.webp', '9, 10, 11 and other sizes', '1–2 kg', 'Price range on request', '10 kg', 14),
  ('Londa / One Piece (10 gauge)', 'Assets/products/one-piece.webp', '18–40 inch', '4–45 kg', 'Price range on request', '10 kg', 15)
) as catalogue(name, image_url, size, approx_weight, price, minimum_order, sort_order)
where not exists (
  select 1 from public.products existing where lower(existing.name) = lower(catalogue.name)
);
