# Shudh Loha

A responsive business website for Shudh Loha, a Sarbloh and pure iron kitchenware business based in Malerkotla, Punjab.

## Project Overview

This client-style project presents the brand story, product collections, individual product details, ordering guidance, contact information, social links, and location details in a mobile-friendly experience.

## Features

- Responsive landing page for desktop and mobile
- Product collection cards with dedicated detail pages
- Product-specific WhatsApp inquiry links
- Direct phone and WhatsApp contact actions
- Hindi and Punjabi navigation labels
- Instagram, Facebook, and Google Maps links
- LocalBusiness structured data and Open Graph metadata
- Accessible focus states and mobile navigation state
- GitHub Pages deployment workflow

## Built With

- Semantic HTML5
- CSS3 with responsive layouts and CSS variables
- Vanilla JavaScript
- Inline SVG icons
- GitHub Actions for deployment

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project Structure

```text
.
├── index.html          # Homepage and product collection
├── product.html        # Reusable product detail page
├── logo.png            # Brand logo
├── Sarbloh_*.png       # Product photography
└── .github/workflows/  # GitHub Pages deployment
```

## Updating Products

Product data is maintained in the `sarblohItems` and `kitchenItems` arrays in `index.html`. Product detail data and image mappings are maintained in `product.html`.

To add a photographed product:

1. Add its image to the project folder.
2. Add the product to the relevant array in `index.html`.
3. Add the matching image mapping in `product.html`.
4. Test the homepage and detail link locally.

Keep sizes, weights, prices, delivery terms, and customer claims verified with the business before publishing them.

## Deployment

The repository includes a GitHub Pages workflow. After pushing the project to GitHub:

1. Open the repository's **Settings > Pages**.
2. Set the source to **GitHub Actions**.
3. Push changes to the `main` branch.

Every future push to `main` will publish the current site automatically.

## Portfolio Description

Designed and developed a responsive static business website for a traditional Sarbloh cookware brand, including product detail routing, multilingual UI labels, WhatsApp commerce flows, local SEO metadata, accessible navigation, and automated GitHub Pages deployment.
