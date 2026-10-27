# SHUDH LOHA — COMPREHENSIVE B2B & D2C PROJECT SPECIFICATION

## 1. Business Identity & Commercial Profile
- Brand: Shudh Loha (Pure Iron / Sarbloh Cookware & Utensils)
- Manufacturing Hub: Malerkotla, Punjab, India
- Direct Line / WhatsApp: +91 79732 47767
- Primary Business Focus (70%): B2B Wholesale Supply
  - Target Clients: Dhabas, Highway Restaurants, Halwais, Banquet Caterers, Gurdwara Langar Committees, Kitchenware Distributors, Supermarkets, Kirana/Bazaar Resellers.
  - Bulk Products: Heavy-gauge Tikki Tavis, Commercial Deep Kadhais (14" to 36"+), Commercial Degs (5kg to 50kg capacity), bulk sets of Karchis/Skimmers/Spoons.
  - Value Props for B2B: Direct factory rates from Malerkotla, heavy-gauge steel/pure iron that withstands commercial burners without warping, custom sizing, GST invoice, and reliable transport across North India & Pan-India.
- Secondary Business Focus (30%): D2C Household Retail
  - Target Clients: Health-conscious families (switching from non-stick/Teflon), traditional cooks, Sikh community seeking pure Sarbloh.
  - Retail Products: 10"-12" Tutma Tawa, Family Kadhais, Fry Pans, Serving Batte, Utensil sets.

---

## 2. Social Media Audit & Pivot Strategy
### Current Status:
- Platforms: Instagram (`@shudh_loha_enterprise`) & Facebook.
- Current Numbers: ~30 posts / reels published, ~16 followers. Near-zero organic reach or conversion.

### Diagnosis — Why Growth Is Stalled:
1. **The Flyer Trap:** The account has been posting polished promotional graphics, ads, and static product cutouts. Modern algorithms completely suppress static commercial ads from zero-authority accounts.
2. **Missing Video Hooks:** The first 2 seconds of reels lack curiosity or conflict. Viewers scroll past within 0.8 seconds.
3. **Channel Misalignment for B2B:** Business owners (dhaba owners, wholesale buyers) don't discover suppliers through branded retail graphics. They discover suppliers via:
   - Google Maps / Google My Business (Searching *"iron kadhai manufacturer near me"* or *"Malerkotla loha mandi"*).
   - IndiaMART inquiries.
   - Raw factory videos demonstrating bulk production and transport dispatches.
   - Word of mouth and direct WhatsApp status sharing.

### The Turnaround Content Playbook (3 Content Pillars):
1. **Pillar 1: Raw Factory & Craft (Viral Potential / Reach)**
   - Format: 7–15 second Reels with trending rustic/Punjabi audio or raw industrial sounds (ASMR).
   - Hook ideas:
     - *"Ever wondered how a 25kg Sarbloh Kadahi is forged from raw iron?"*
     - Red-hot iron being hammered into shape.
     - Lathe buffing sparks flying across the factory floor.
2. **Pillar 2: Commercial Torture & Heat Tests (B2B Trust)**
   - Format: 20–30 second demonstrations showing heavy-duty usage.
   - Hook ideas:
     - *"Why dhabas never use non-stick: Watch this 5kg Tikki Tawa handle a 100,000 BTU burner."*
     - Dropping a commercial kadhai to show it will never crack like cast iron or warp like thin aluminum.
     - Sizzling seasoning on an iron tawa with hot mustard oil.
3. **Pillar 3: The Daily Dispatch & Proof of Business (Social Proof)**
   - Format: Behind-the-scenes quick clips.
   - Hook ideas:
     - Packing a 100-piece order for a restaurant chain in Delhi or Ludhiana.
     - Stacking finished degs ready for transport.
     - Caption: *"Wholesale catalog link in bio. Pan-India dispatch from Malerkotla."*

---

## 3. Website Funnel Architecture (Dual-Funnel Redesign)

### Homepage Structure (`index.html`):
1. **Top Announcement Bar:** *"Direct Manufacturer Rates from Malerkotla | Supplying Dhabas, Caterers & Retail Nationwide"*
2. **Hero Section:**
   - Headline: *"Heavy-Duty Pure Iron (Sarbloh) Cookware — Direct From The Maker."*
   - Subhead: *"Built for high-heat commercial kitchens, dhabas, and traditional home cooking. No Teflon. No cheap alloys. Pure strength."*
   - Dual CTAs:
     - `[ Download Wholesale Catalog / B2B Inquiry ]` (Primary - Gold Button)
     - `[ Browse Household Cookware ]` (Secondary - Outlined Button)
3. **The Dual Split Section:**
   - **Column A: For Commercial Kitchens & Wholesalers** (Dhabas, Caterers, Gurdwaras)
     - Heavy-gauge construction (won't bend under commercial high flame).
     - Custom sizes up to 50kg degs & 36" kadhais.
     - Bulk tiered pricing & Transport delivery.
     - CTA: *"Request Bulk Quote on WhatsApp"*
   - **Column B: For Healthy Everyday Cooking** (Home Kitchens)
     - 100% Food-safe pure iron, natural iron boost, lasts generations.
     - Pre-seasoned tips & retail shipping.
     - CTA: *"View Retail Collection"*
4. **Product Showcase Grid:**
   - Features key products with dual price indicators:
     - *Retail:* "₹499 each"
     - *Wholesale:* "Bulk Rates from ₹280/pc (MOQ: 10 pcs)" or "Call/WhatsApp for Wholesale Lot"
5. **How B2B Ordering Works (3 Steps):**
   - Step 1: Browse catalog or tell us your required sizes/weights.
   - Step 2: Receive immediate wholesale quote & transport options via WhatsApp.
   - Step 3: Fast dispatch from Malerkotla factory with GST invoice.
6. **Factory Credibility & Map:**
   - Factory address in Malerkotla, Punjab.
   - Embed Google Map with verified directions.
   - Real photos of the workshop and finished bulk stock (not generic stock photos).

---

## 4. Technical & Database Architecture
- **Tech Stack:** Semantic HTML5, Modular CSS (`css/style.css`), Vanilla JS (`js/main.js`, `js/catalog.js`), Supabase (PostgreSQL + RLS).
- **Supabase Schema Tables:**
  - `products`: id, name, category, image_url, retail_price, wholesale_price, moq, is_active, sort_order.
  - `leads`: id, kind (`whatsapp`, `phone`, `bulk_quote`, `retail`), product_name, business_name, phone, requirements, created_at.
  - `page_views`: Lightweight analytics.
- **Security Priority:**
  - Ensure Row Level Security (RLS) policies strictly forbid unauthenticated or public users from reading lead phone numbers or altering products. Only authenticated admin email can read/write administrative data.
- **Image Performance Target:**
  - Convert all 2MB+ PNG assets into compressed WebP format (<60KB each) to keep the total page size under 1.2MB for mobile browsing in India.