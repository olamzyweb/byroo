# Byroo Architecture

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase: Auth, Postgres, Storage
- Stripe (via provider abstraction)
- Vercel deployment target

## High-level Components
- Public web app: landing, pricing, public profile page `/[username]`
- Auth pages: signup/login/reset
- Protected dashboard: profile, links, portfolio, services, appearance, billing, analytics
- API routes:
  - `/api/analytics/view` (profile views)
  - `/api/analytics/click` (link clicks)
  - `/api/billing/checkout` (create checkout)
  - `/api/billing/portal` (customer portal)
  - `/api/billing/webhook` (provider webhook)

## Data Access Strategy
- Browser and server Supabase clients for auth and user-scoped reads.
- Service-role client for privileged operations and webhook handling.
- Server actions perform write operations with validation and plan checks.

## Security Model
- Supabase auth with protected dashboard routes.
- SQL row level security policies scoped by `auth.uid()`.
- Feature gating enforced in server actions and SQL constraints where practical.
- No secrets exposed to client; public env vars limited to anon key and app URL.

## Billing Abstraction
- `BillingProvider` interface defines checkout, portal, and webhook processing contract.
- Stripe implementation plugged via config.
- Future Paystack provider can implement same interface without changing app pages.

## Analytics Model
- First-party event capture to `analytics_events` table.
- Event types: `profile_view`, `link_click`.
- Dashboard summary query aggregates counts and top links.
- Privacy-conscious fields use hashed IP and user agent.

## Deployment Topology
- Vercel hosts Next.js app.
- Supabase project hosts DB/Auth/Storage.
- Stripe handles recurring billing.
- Environment variables managed in Vercel project settings.

## Extensibility
- Additional providers: billing adapters.
- More page blocks/themes via database-driven config.
- Optional caching layer and edge analytics later without schema reset.
