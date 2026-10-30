# Shudh Loha Business Site

A modern storefront and catalog website for Shudh Loha, a business focused on traditional pure-iron cookware and kitchen essentials from Malerkotla, Punjab.

This project is built as a static website using HTML, CSS, and JavaScript, with Supabase powering product data, lead capture, analytics, and admin management.

## Overview

Shudh Loha sells hand-finished iron kitchenware such as:

- Sarbloh / pure iron cookware
- Tawa, kadahi, deg, tava, and fry pan
- Kitchen utensils like spoons, forks, and serving sets
- Traditional household ironware products

The site is designed to:

- showcase premium products with product imagery
- allow visitors to browse and filter categories
- collect leads via WhatsApp, phone, and enquiry forms
- track product views and page traffic
- support an admin dashboard for product and lead management

## Features

- Elegant storefront landing page
- Product catalog and category filters
- Product detail pages and image-driven presentation
- Contact / WhatsApp lead collection
- Built-in Supabase integration for storage and table-driven data
- Admin portal for products, leads, and analytics
- Responsive layout for desktop and mobile devices

## Project Structure

- `index.html` — main storefront homepage
- `products.html` — product catalog page
- `product.html` — individual product view
- `admin.html` — admin dashboard and management UI
- `maintenance.html` — maintenance / temporary site page
- `supabase-config.js` — Supabase client configuration and tracking logic
- `supabase-schema.sql` — database schema and policies for products, leads, and analytics
- `Assets/` and `Assets 2/` — product images and brand assets
- `Social/` — promotional content and social media assets

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Supabase
- Static hosting compatible (Netlify, Vercel, GitHub Pages, or any static web host)

## Local Setup

1. Clone the repository.
2. Open the project folder in your editor.
3. Start a local web server, for example:

```bash
python -m http.server 8000
```

4. Open the site in your browser:

```text
http://localhost:8000/
```

If you want to run the site from the filesystem directly, opening `index.html` in a browser also works for most static pages.

## Supabase Setup

This project uses Supabase for:

- product data
- page views
- completed lead submissions
- admin access
- product image storage buckets

### Steps

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase-schema.sql`.
3. Update `supabase-config.js` with your project URL and anon key if needed.
4. Make sure the storage bucket `product-images` is available if you plan to upload product media.
5. Access the admin portal through `admin.html` after configuring auth and policies.

The schema includes optional `products.size` and `products.payment_link` fields for
retail card order messages and direct payment links. Add a hosted HTTPS checkout
URL or UPI payment URI to a product to show its optional pay button. Reviews are
hidden until approved records are added to `product_reviews`; new review records
are unapproved by default and only the configured admin can publish them.

Homepage banners can optionally include a photo uploaded from the admin portal.
The photo is stored in the `product-images` Supabase Storage bucket and referenced
by `offers.image_url`; run the updated `supabase-schema.sql` before saving banner
photos.

To replace the storefront's Sarbloh list and specifications with the product
catalogue, run `supabase-catalogue-product-specs.sql` in the Supabase SQL editor
before deploying the updated pages. The migration keeps non-Sarbloh categories
unchanged and makes only the 14 catalogue products visible in the Sarbloh
storefront.

## Deployment

This project is well-suited for static hosting providers such as:

- Netlify
- Vercel
- GitHub Pages

After deployment:

- upload the project files to the hosting provider
- ensure the Supabase environment is configured
- verify product pages and contact forms work correctly

## Customization

You can personalize the site by editing:

- product names and details in Supabase; keep numeric prices private and share ranges by request
- colors and branding in the CSS inside the HTML files
- product imagery under `Assets/` and `Assets 2/`
- social/contact information in the page content and Supabase data

### Product image processing

Put PNG or JPG product images in `product-images-raw/` and run
`python process_product_images.py`. The script pads images to square without
cropping, exports 1200 x 1200 WebP files to `Assets/products/`, and lowers
quality in steps from 85 until each file is under 200 KB. It prints a size
report and flags any output that remains over the limit. Deploy the generated
files before running `supabase-catalogue-product-specs.sql`; that migration
updates the matching primary and gallery photo paths as it refreshes existing
catalogue rows. For an already-migrated catalogue that only needs its photos
refreshed, run `supabase-product-image-paths.sql` instead. It also removes
public numeric product prices; run it to update existing Supabase catalogue
rows. Public pages and the downloadable catalogue show price ranges on request.

## Business Context

Shudh Loha is positioned as a traditional, quality-focused iron cookware brand. The website reflects a premium handcrafted aesthetic with earthy tones, heritage styling, and a direct-sales shopping experience.

## Notes

- The project is primarily front-end based and does not require a complex backend framework.
- If you plan to maintain or expand the store, Supabase provides a simple path to add product management and analytics.
- Keep the site assets organized in the existing `Assets` folders for easy updates and product additions.

## Contact

For business enquiries, the site references a Punjabi cookware and traditional iron products business with a strong e-commerce / catalog presence.

If you are using this project for a live business site, update contact details, WhatsApp links, and store information before publishing.
