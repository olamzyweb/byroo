# Byroo

Byroo is a WhatsApp-first storefront and digital business page SaaS for Nigerian vendors and small businesses.

Public profile format:
- `/{username}`

## Positioning
Byroo is not a WhatsApp replacement.
- Byroo = storefront page
- WhatsApp = order/inquiry channel

## Core Features
- Email auth + protected dashboard
- Profile, links, portfolio, services, appearance
- Catalog management for products
- WhatsApp settings (global + item/service prefill)
- Reviews/testimonials
- Social Proof Block (Instagram/TikTok cached trust cards)
- Business info blocks (location/maps/hours/delivery)
- Public storefront rendering in mobile-first section order
- Billing abstraction + analytics

## Tech Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase (Postgres/Auth/Storage)
- Billing provider abstraction (Stripe or Paystack)

## Routes
Public:
- `/`
- `/pricing`
- `/login`
- `/signup`
- `/reset-password`
- `/{username}`

Dashboard:
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/whatsapp`
- `/dashboard/links`
- `/dashboard/socials`
- `/dashboard/catalog`
- `/dashboard/services`
- `/dashboard/portfolio`
- `/dashboard/reviews`
- `/dashboard/business`
- `/dashboard/appearance`
- `/dashboard/analytics`
- `/dashboard/billing`

Admin:
- `/admin`
- `/admin/users`
- `/admin/subscriptions`
- `/admin/analytics`
- `/admin/system`

## Plan Limits
Free:
- 5 links
- 3 portfolio items
- 5 catalog items
- 6 services
- 2 reviews
- 1 social proof card
- only `byroo-light` theme
- branding visible
- analytics unavailable

Pro:
- unlimited key content limits
- all themes
- hide branding
- analytics enabled
- up to 2 social proof cards

## Setup
1. `npm install`
2. Copy env:
   - `Copy-Item .env.example .env.local`
3. Fill env values.
4. Run SQL in Supabase:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
   - `supabase/migrations/20260311_nigeria_whatsapp_vendor_extension.sql`
   - `supabase/migrations/20260311_paystack_billing_extension.sql`
   - `supabase/migrations/20260312_profile_header_image.sql`
   - `supabase/migrations/20260312_catalog_storage_bucket.sql`
   - `supabase/migrations/20260312_admin_panel.sql`
   - `supabase/migrations/20260312_social_proof_block.sql`
   - `supabase/migrations/20260312_more_themes_and_free_catalog_limit.sql`
5. Create storage buckets:
   - `avatars` (public)
   - `portfolio` (public)
   - `catalog` (public)
6. `npm run dev`
7. Bootstrap admin access:
   - Insert your user id into `admin_users` (see `docs/SETUP.md`)
8. Optional social sync setup:
   - set `SOCIAL_PROFILE_PROVIDER=searchapi`
   - set `SEARCHAPI_API_KEY`
   - optional: set `SEARCHAPI_BASE_URL`
   - optional alternate provider: Apify vars
   - set `SOCIAL_SYNC_CRON_SECRET`

## Paystack Billing Setup
- Set `BILLING_PROVIDER=paystack`
- Set:
  - `PAYSTACK_SECRET_KEY`
  - `PAYSTACK_PRO_PLAN_CODE`
  - `PAYSTACK_CALLBACK_URL`
- Configure Paystack webhook URL:
  - `https://your-domain.com/api/billing/webhook`

## Key Docs
- [docs/PRD.md](docs/PRD.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DB_SCHEMA.md](docs/DB_SCHEMA.md)
- [docs/TASKS.md](docs/TASKS.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
- [docs/SETUP.md](docs/SETUP.md)
- [docs/DEPLOY.md](docs/DEPLOY.md)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- [docs/COMPONENTS.md](docs/COMPONENTS.md)
- [docs/UI_GUIDE.md](docs/UI_GUIDE.md)
- [docs/ADMIN_PANEL.md](docs/ADMIN_PANEL.md)
