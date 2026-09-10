-- Run this once in the Supabase SQL editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Iron Kitchenware',
  description text not null default 'Pure iron and hand-finished.',
  image_url text,
  price text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Public can create leads" on public.leads;
drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Public can create page views" on public.page_views;
drop policy if exists "Admins can read page views" on public.page_views;
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

insert into public.products (name, image_url, sort_order)
values
  ('Big Deg', 'Assets 2/Big Deg.jpeg', 1),
  ('Tutma Tava', 'Assets 2/tutma tawa.png', 2),
  ('Tikki Tavi', 'Assets 2/Tikki Tavi.jpeg', 3),
  ('White Batta', 'Assets 2/White batta.png', 4),
  ('Batta', 'Assets 2/batta.png', 5),
  ('Kadhai', 'Assets 2/kadhai.png', 6),
  ('Deg', 'Assets 2/deg.png', 7),
  ('Iron Tawa', 'Assets 2/tawi.png', 8),
  ('Fry Pan', 'Assets 2/fry pan.png', 9),
  ('Iron Fork', 'Assets 2/fork.png', 10),
  ('Iron Spoon', 'Assets 2/karchi without handle.png', 11),
  ('Set of Glasses', 'Assets 2/glasses.png', 12),
  ('Tawa', 'Assets 2/tawa.png', 13)
on conflict do nothing;