-- Run this once in the Supabase SQL editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Sarbloh',
  description text not null default 'Pure iron and hand-finished.',
  image_url text,
  image_urls jsonb not null default '[]'::jsonb,
  price text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists image_urls jsonb not null default '[]'::jsonb;

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
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.page_views enable row level security;
alter table public.visitor_profiles enable row level security;
alter table public.visitor_item_views enable row level security;
alter table public.offers enable row level security;

drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Public can create leads" on public.leads;
drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Public can create page views" on public.page_views;
drop policy if exists "Admins can read page views" on public.page_views;
drop policy if exists "Visitors can create own profile" on public.visitor_profiles;
drop policy if exists "Visitors can update own profile" on public.visitor_profiles;
drop policy if exists "Authenticated can read visitor profiles" on public.visitor_profiles;
drop policy if exists "Visitors can create own item views" on public.visitor_item_views;
drop policy if exists "Authenticated can read item views" on public.visitor_item_views;
drop policy if exists "Public can view active offers" on public.offers;
drop policy if exists "Admins can manage offers" on public.offers;
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

create policy "Public can view active products" on public.products
  for select using (is_active = true);
create policy "Admins can manage products" on public.products
  for all to authenticated using (true) with check (true);
create policy "Public can create leads" on public.leads
  for insert with check (true);
create policy "Admins can read leads" on public.leads
  for select to authenticated using (true);
create policy "Public can create page views" on public.page_views
  for insert with check (true);
create policy "Admins can read page views" on public.page_views
  for select to authenticated using (true);
create policy "Visitors can create own profile" on public.visitor_profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Visitors can update own profile" on public.visitor_profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Authenticated can read visitor profiles" on public.visitor_profiles
  for select to authenticated using (true);
create policy "Visitors can create own item views" on public.visitor_item_views
  for insert to authenticated with check (auth.uid() = visitor_id);
create policy "Authenticated can read item views" on public.visitor_item_views
  for select to authenticated using (true);
create policy "Public can view active offers" on public.offers
  for select using (is_active = true);
create policy "Admins can manage offers" on public.offers
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admins can upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');
create policy "Admins can update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');
create policy "Admins can delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

update public.products
set category = 'Sarbloh'
where category = 'Iron Kitchenware';

insert into public.products (name, category, image_url, sort_order)
values
  ('Big Deg', 'Sarbloh', 'Assets 2/Big Deg.jpeg', 1),
  ('Tutma Tava', 'Sarbloh', 'Assets 2/tutma tawa.png', 2),
  ('Tikki Tavi', 'Sarbloh', 'Assets 2/Tikki Tavi.jpeg', 3),
  ('White Batta', 'Sarbloh', 'Assets 2/White batta.png', 4),
  ('Batta', 'Sarbloh', 'Assets 2/batta.png', 5),
  ('Kadhai', 'Sarbloh', 'Assets 2/kadhai.png', 6),
  ('Deg', 'Sarbloh', 'Assets 2/deg.png', 7),
  ('Iron Tawa', 'Sarbloh', 'Assets 2/tawi.png', 8),
  ('Fry Pan', 'Sarbloh', 'Assets 2/fry pan.png', 9),
  ('Iron Fork', 'Sarbloh', 'Assets 2/fork.png', 10),
  ('Iron Spoon', 'Sarbloh', 'Assets 2/karchi without handle.png', 11),
  ('Set of Glasses', 'Sarbloh', 'Assets 2/glasses.png', 12),
  ('Tawa', 'Sarbloh', 'Assets 2/tawa.png', 13)
on conflict do nothing;