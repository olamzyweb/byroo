# Byroo Architecture

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase: Auth, Postgres, Storage
- Stripe (billing abstraction)
- Vercel deployment target

## Product Architecture
Byroo acts as storefront + identity layer.
WhatsApp is the downstream order/inquiry channel.

Flow:
1. Visitor opens public Byroo page.
2. Visitor browses catalog/services/reviews/business info.
3. Visitor taps CTA.
4. CTA opens WhatsApp with prefilled context.

## Modules

### Public Web
- `/[username]` storefront renderer
- Theme-aware section blocks
- First-party analytics capture
- Social proof cards rendered from cached DB records

### Dashboard
- Profile + social management
- Social proof manager (`/dashboard/socials`)
- WhatsApp settings
- Links manager
- Catalog manager
- Services/price-list manager
- Portfolio manager
- Reviews manager
- Business info manager
- Billing + analytics

### Admin Console
- `/admin` platform overview metrics
- `/admin/users` account support operations (plan/admin toggles)
- `/admin/subscriptions` billing sync diagnostics + manual sync
- `/admin/analytics` platform traffic summaries
- `/admin/system` storage health + audit feed

### Backend
- Server actions handle writes and plan-gating
- Supabase service-role used for public reads and uploads
- RLS for user-owned tables
- Provider-agnostic social sync layer (SearchAPI-first implementation, swappable)
- Scheduled sync endpoint for stale social profile refresh

## Data Model Additions
- `catalog_items`
- `testimonials`
- Extended `profiles` for business/social metadata
- Extended `services` for CTA type, WhatsApp prefill, availability
- `admin_users` (admin access control)
- `admin_audit_logs` (internal action trace)
- `social_profiles` (Instagram/TikTok normalized cache)

## Billing Abstraction
- `BillingProvider` interface unchanged
- Stripe remains active provider
- Future Paystack provider can reuse same contract

## Security Model
- Auth-protected dashboard routes
- Auth-protected admin routes with `admin_users` server-side check
- RLS on user-owned tables (`links`, `portfolio_items`, `services`, `catalog_items`, `testimonials`)
- Feature limits enforced server-side

## WhatsApp Link Strategy
Central helper in `src/lib/whatsapp.ts`:
- global profile-level prefill
- item-specific message templates (`{item_name}`)
- service-specific message templates (`{service_name}`)

## Deployment
- Vercel app
- Supabase DB/Auth/Storage
- Stripe billing webhooks
