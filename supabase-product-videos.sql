-- Run this migration in the Supabase SQL editor to enable product video uploads.
alter table public.products
  add column if not exists video_urls jsonb not null default '[]'::jsonb;

update storage.buckets
set file_size_limit = 104857600
where id = 'product-images';
