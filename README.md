# Byroo

Byroo is a link-in-bio and digital business card SaaS MVP for freelancers, creators, and small businesses.

Public profile format:
- `/{username}`

Tagline:
- Your business space online.

## MVP Features
- Email signup/login/password reset (Supabase Auth)
- Protected dashboard
- Profile setup with username, bio, WhatsApp CTA, avatar upload
- Links CRUD with ordering
- Portfolio CRUD with image upload
- Services CRUD
- Theme selection (1 free + 2 pro)
- Free vs Pro feature gating
- Billing abstraction with Stripe provider implementation
- Lightweight first-party analytics (profile views + link clicks)

## Tech Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase (Postgres/Auth/Storage)
- Stripe (abstracted billing provider)
- Vercel deployment target

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
- `/dashboard/links`
- `/dashboard/portfolio`
- `/dashboard/services`
- `/dashboard/appearance`
- `/dashboard/analytics`
- `/dashboard/billing`

API:
- `POST /api/analytics/view`
- `GET /api/analytics/click`
- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `POST /api/billing/webhook`

## Plan Limits (MVP)
Free:
- 5 links
- 3 portfolio items
- only `byroo-light` theme
- branding always shown
- analytics unavailable

Pro:
- unlimited links
- unlimited portfolio items
- all themes
- hide branding
- analytics enabled

## Quick Start
1. Install dependencies:
```bash
npm install
```

2. Create local env file:
```bash
cp .env.example .env.local
```
(Windows PowerShell)
```powershell
Copy-Item .env.example .env.local
```

3. Fill `.env.local` values.

4. In Supabase SQL editor, run:
- `supabase/schema.sql`
- `supabase/seed.sql`

5. Create storage buckets in Supabase:
- `avatars` (public)
- `portfolio` (public)

6. Start dev server:
```bash
npm run dev
```

## Required Environment Variables
See `.env.example`:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `BILLING_PROVIDER` (`stripe`)

## Development Commands
```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Billing Provider Abstraction
- Interface: `src/lib/billing/types.ts`
- Provider selection: `src/lib/billing/index.ts`
- Stripe implementation: `src/lib/billing/stripe.ts`

To support Paystack later, add a `PaystackBillingProvider` implementing the same interface and switch with `BILLING_PROVIDER`.

## Docs
- [docs/PRD.md](docs/PRD.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/TASKS.md](docs/TASKS.md)
- [docs/DB_SCHEMA.md](docs/DB_SCHEMA.md)
- [docs/SETUP.md](docs/SETUP.md)
- [docs/DEPLOY.md](docs/DEPLOY.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)

## Known MVP Tradeoffs
- Uses server-side admin client for public profile queries and analytics writes.
- Billing flow and webhooks are implemented, but require live Stripe credentials to validate end-to-end.
- Uses basic form UX without advanced optimistic updates.
