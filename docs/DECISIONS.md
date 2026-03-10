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

### Decision: Free plan restrictions
- 5 links
- 3 portfolio items
- 1 theme
- branding cannot be removed
Reason: Strong enough monetization trigger while still useful for adoption.
