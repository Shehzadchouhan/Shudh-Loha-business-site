-- Run after deploying the matching files under Assets/products/.
-- Refresh product images, hide exact product prices, add separate catalogue items,
-- rename Iron Spoon to Karchi / Chamcha (With Handle), and deactivate Iron Fork.
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

update public.products
set image_url = case name
  when 'Handi / Kadni' then 'Assets/products/kadni-handi.webp'
  when 'Tadka Pan' then 'Assets/products/tadka-pan.webp'
  when 'Big Deg' then 'Assets/products/big-deg.webp'
  when 'Tutma Tawa' then 'Assets/products/tutma-tawa.webp'
  when 'Tikki Tawi / Roti Tawi' then 'Assets/products/tawi.webp'
  when 'White Batta / Sarbloh Set' then 'Assets/products/white-batta-set.webp'
  when 'Batta / Sarbloh Set' then 'Assets/products/sarbloh-batta.webp'
  when 'Chotti Kadahi (13–14 gauge)' then 'Assets/products/sarbloh-kadai.webp'
  when 'Chotti Deg / Donga' then 'Assets/products/chotti-deg-dongi.webp'
  when 'Fry Pan' then 'Assets/products/sarbloh-fry-pan.webp'
  when 'Tadka Fry Pan' then 'Assets/products/tadka-fry-pan.webp'
  when 'Karchi / Chamcha (Without Handle)' then 'Assets/products/karchi-without-handle.webp'
  when 'Karchi / Chamcha (With Handle)' then 'Assets/products/chamcha-with-handle.webp'
  when 'Iron Plain Tawa' then 'Assets/products/plane-tawa.webp'
  when 'Londa / One Piece (10 gauge)' then 'Assets/products/one-piece.webp'
end,
price = 'Price range on request',
image_urls = '[]'::jsonb,
sort_order = case name
  when 'Handi / Kadni' then 1
  when 'Tadka Pan' then 2
  when 'Big Deg' then 3
  when 'Tutma Tawa' then 4
  when 'Tikki Tawi / Roti Tawi' then 5
  when 'White Batta / Sarbloh Set' then 6
  when 'Batta / Sarbloh Set' then 7
  when 'Chotti Kadahi (13–14 gauge)' then 8
  when 'Chotti Deg / Donga' then 9
  when 'Fry Pan' then 10
  when 'Tadka Fry Pan' then 11
  when 'Karchi / Chamcha (Without Handle)' then 12
  when 'Karchi / Chamcha (With Handle)' then 13
  when 'Iron Plain Tawa' then 14
  when 'Londa / One Piece (10 gauge)' then 15
end
where name in (
  'Handi / Kadni',
  'Tadka Pan',
  'Big Deg',
  'Tutma Tawa',
  'Tikki Tawi / Roti Tawi',
  'White Batta / Sarbloh Set',
  'Batta / Sarbloh Set',
  'Chotti Kadahi (13–14 gauge)',
  'Chotti Deg / Donga',
  'Fry Pan',
  'Tadka Fry Pan',
  'Karchi / Chamcha (Without Handle)',
  'Karchi / Chamcha (With Handle)',
  'Iron Plain Tawa',
  'Londa / One Piece (10 gauge)'
);

insert into public.products (name, category, image_url, image_urls, price, sort_order, is_active)
select catalogue.name, 'Sarbloh', catalogue.image_url, '[]'::jsonb,
       'Price range on request', catalogue.sort_order, true
from (values
  ('Tadka Fry Pan', 'Assets/products/tadka-fry-pan.webp', 11),
  ('Karchi / Chamcha (Without Handle)', 'Assets/products/karchi-without-handle.webp', 12),
  ('Karchi / Chamcha (With Handle)', 'Assets/products/chamcha-with-handle.webp', 13)
) as catalogue(name, image_url, sort_order)
where not exists (
  select 1
  from public.products existing
  where lower(trim(existing.name)) = lower(catalogue.name)
);

update public.products product
set category = 'Sarbloh',
    image_url = catalogue.image_url,
    image_urls = '[]'::jsonb,
    price = 'Price range on request',
    sort_order = catalogue.sort_order,
    is_active = true,
    updated_at = now()
from (values
  ('Tadka Fry Pan', 'Assets/products/tadka-fry-pan.webp', 11),
  ('Karchi / Chamcha (Without Handle)', 'Assets/products/karchi-without-handle.webp', 12),
  ('Karchi / Chamcha (With Handle)', 'Assets/products/chamcha-with-handle.webp', 13)
) as catalogue(name, image_url, sort_order)
where lower(trim(product.name)) = lower(catalogue.name);

update public.products
set price = 'Price range on request',
    updated_at = now()
where category in ('Sarbloh', 'Iron Kitchenware')
  and price is distinct from 'Price range on request';

update public.products
set is_active = false,
    updated_at = now()
where lower(trim(name)) = 'iron fork';
