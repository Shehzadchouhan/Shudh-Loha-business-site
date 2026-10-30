-- Run in the Supabase SQL editor to replace the Sarbloh storefront list
-- with the 15 products and four specification fields from the catalogue.
begin;

alter table public.products add column if not exists size text;
alter table public.products add column if not exists approx_weight text;
alter table public.products add column if not exists minimum_order text;

create temporary table catalogue_product_specs (
  name text primary key,
  aliases text[] not null,
  image_url text,
  size text not null,
  approx_weight text not null,
  price text not null,
  minimum_order text not null,
  sort_order integer not null
) on commit drop;

insert into catalogue_product_specs (name, aliases, image_url, size, approx_weight, price, minimum_order, sort_order)
values
  ('Handi / Kadni', array['Handi / Kadni'], 'Assets/products/kadni-handi.webp', '6, 7, 8 muh', '3–8 kg', 'Price range on request', '10 kg', 1),
  ('Tadka Pan', array['Tadka Pan'], 'Assets/products/tadka-pan.webp', '6–10 muh', '700 g–2 kg', 'Price range on request', '10 kg', 2),
  ('Big Deg', array['Big Deg'], 'Assets/products/big-deg.webp', '14 inch and above', '7 kg and above', 'Price range on request', '10 kg', 3),
  ('Tutma Tawa', array['Tutma Tawa', 'Tutma Tava'], 'Assets/products/tutma-tawa.webp', '9, 10, 11 and other sizes', '1–2 kg', 'Price range on request', '10 kg', 4),
  ('Tikki Tawi / Roti Tawi', array['Tikki Tawi / Roti Tawi', 'Tikki Tavi', 'Iron Tawi', 'Iron Tawa'], 'Assets/products/tawi.webp', '16–40 inch', '4 kg and above', 'Price range on request', '10 kg', 5),
  ('White Batta / Sarbloh Set', array['White Batta / Sarbloh Set', 'White Batta'], 'Assets/products/white-batta-set.webp', '6, 7, 8 and other sizes', '200 g–1 kg', 'Price range on request', '10 kg', 6),
  ('Batta / Sarbloh Set', array['Batta / Sarbloh Set', 'Batta'], 'Assets/products/sarbloh-batta.webp', '6, 7, 8 and other sizes', '200 g–1 kg', 'Price range on request', '10 kg', 7),
  ('Chotti Kadahi (13–14 gauge)', array['Chotti Kadahi (13–14 gauge)', 'Kadhai'], 'Assets/products/sarbloh-kadai.webp', '12–18 inch', '1.25–4 kg', 'Price range on request', '10 kg', 8),
  ('Chotti Deg / Donga', array['Chotti Deg / Donga', 'Deg'], 'Assets/products/chotti-deg-dongi.webp', '6, 7, 8 muh', '3–8 kg', 'Price range on request', '10 kg', 9),
  ('Fry Pan', array['Fry Pan'], 'Assets/products/sarbloh-fry-pan.webp', '9, 10, 11, 12 inch', '1–2 kg', 'Price range on request', '10 kg', 10),
  ('Tadka Fry Pan', array['Tadka Fry Pan'], 'Assets/products/tadka-fry-pan.webp', '6–10 muh', '700 g–2 kg', 'Price range on request', '10 kg', 11),
  ('Karchi / Chamcha (Without Handle)', array['Karchi / Chamcha (Without Handle)', 'Karchi without Handle', 'Chamcha without Handle'], 'Assets/products/karchi-without-handle.webp', '9, 10, 11, 12 inch', '1–2 kg', 'Price range on request', '10 kg', 12),
  ('Karchi / Chamcha (With Handle)', array['Karchi / Chamcha (With Handle)', 'Iron Spoon', 'Chamcha with Handle', 'Karchi with Handle'], 'Assets/products/chamcha-with-handle.webp', '15–24 inch', '500 g–2 kg', 'Price range on request', '10 kg', 13),
  ('Iron Plain Tawa', array['Iron Plain Tawa', 'Tawa', 'Iron Tava'], 'Assets/products/plane-tawa.webp', '9, 10, 11 and other sizes', '1–2 kg', 'Price range on request', '10 kg', 14),
  ('Londa / One Piece (10 gauge)', array['Londa / One Piece (10 gauge)'], 'Assets/products/one-piece.webp', '18–40 inch', '4–45 kg', 'Price range on request', '10 kg', 15);

update public.products
set is_active = false,
    updated_at = now()
where category in ('Sarbloh', 'Iron Kitchenware');

with matches as (
  select
    p.id,
    c.name,
    c.image_url,
    c.size,
    c.approx_weight,
    c.price,
    c.minimum_order,
    c.sort_order,
    row_number() over (
      partition by c.name
      order by case when lower(p.name) = lower(c.name) then 0 else 1 end,
               p.sort_order,
               p.created_at
    ) as match_rank
  from public.products p
  cross join catalogue_product_specs c
  where exists (
    select 1
    from unnest(c.aliases) as aliases(alias)
    where lower(trim(p.name)) = lower(alias)
  )
)
update public.products p
set name = m.name,
    category = 'Sarbloh',
    image_url = coalesce(m.image_url, p.image_url),
    image_urls = '[]'::jsonb,
    size = m.size,
    approx_weight = m.approx_weight,
    price = m.price,
    minimum_order = m.minimum_order,
    sort_order = m.sort_order,
    is_active = true,
    updated_at = now()
from matches m
where p.id = m.id
  and m.match_rank = 1;

insert into public.products (
  name, category, image_url, image_urls, size, approx_weight, price, minimum_order, sort_order, is_active
)
select
  c.name,
  'Sarbloh',
  c.image_url,
  '[]'::jsonb,
  c.size,
  c.approx_weight,
  c.price,
  c.minimum_order,
  c.sort_order,
  true
from catalogue_product_specs c
where not exists (
  select 1
  from public.products p
  where lower(p.name) = lower(c.name)
);

commit;
