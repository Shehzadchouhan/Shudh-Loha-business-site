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

- product names and pricing in the Supabase content or frontend templates
- colors and branding in the CSS inside the HTML files
- product imagery under `Assets/` and `Assets 2/`
- social/contact information in the page content and Supabase data

## Business Context

Shudh Loha is positioned as a traditional, quality-focused iron cookware brand. The website reflects a premium handcrafted aesthetic with earthy tones, heritage styling, and a direct-sales shopping experience.

## Notes

- The project is primarily front-end based and does not require a complex backend framework.
- If you plan to maintain or expand the store, Supabase provides a simple path to add product management and analytics.
- Keep the site assets organized in the existing `Assets` folders for easy updates and product additions.

## Contact

For business enquiries, the site references a Punjabi cookware and traditional iron products business with a strong e-commerce / catalog presence.

If you are using this project for a live business site, update contact details, WhatsApp links, and store information before publishing.
