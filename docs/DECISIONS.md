# Decisions Log

## 2026-03-10

### Decision: Next.js App Router + TypeScript
Reason: Single codebase for SSR public pages, dashboard, server actions, and API routes with minimal infrastructure overhead.

### Decision: Supabase for auth/data/storage
Reason: Fastest path to production SaaS MVP with managed Postgres and auth.

### Decision: Stripe first with provider abstraction
Reason: Stripe speeds up recurring billing. Abstraction in `src/lib/billing` keeps future Paystack switch low-impact.

### Decision: First-party lightweight analytics
Reason: MVP needs own core metrics (views/clicks) without external heavy dependency.

### Decision: Server-side feature gating
Reason: Prevent bypass of plan limits by enforcing checks in server actions and webhook-driven plan sync.

## 2026-03-11

### Decision: Reposition Byroo for Nigerian WhatsApp vendors
Reason: Stronger product-market fit by focusing on storefront-before-WhatsApp workflow.

### Decision: Keep WhatsApp as channel, not platform replacement
Reason: Users already transact in WhatsApp; Byroo should optimize discovery and conversion before chat.

### Decision: Add catalog + testimonials + business info as first-class blocks
Reason: Vendors need product visibility and trust signals before customers message.

### Decision: Extend profile table for business/social metadata
Reason: Faster implementation and fewer joins for public storefront rendering in MVP.

### Decision: Add dedicated tables for `catalog_items` and `testimonials`
Reason: These are repeatable business entities with ordering and plan limits.

### Decision: Add granular plan gates (catalog/services/reviews)
Reason: Monetization needs meaningful but practical free limits.

### Decision: Centralize WhatsApp deep-link generation
Reason: Consistent message templates and easier iteration across item/service CTAs.

## 2026-03-12

### Decision: Use dedicated `admin_users` allow-list instead of profile role field
Reason: Prevent privilege escalation through self-profile updates under existing RLS policies.

### Decision: Add a lightweight internal admin console in-app
Reason: Faster operational support for billing sync, user plan fixes, and growth monitoring without a separate backend tool.

### Decision: Log high-impact admin actions to `admin_audit_logs`
Reason: Preserve accountability and traceability for manual interventions.

### Decision: Add Social Proof Block as cached profile cards, not live feeds
Reason: Trust signal value is high while implementation risk and cost stay low without feed complexity.

### Decision: Use provider abstraction with SearchAPI-first implementation
Reason: Keeps social data source swappable while shipping quickly with practical public profile fetch capability.

### Decision: Server-side sync + cached rendering
Reason: Prevent slow public page loads and avoid client-side scraping/runtime failures.

### Decision: Social proof plan gates (Free: 1, Pro: 2)
Reason: Adds meaningful monetization while keeping free plan useful.
