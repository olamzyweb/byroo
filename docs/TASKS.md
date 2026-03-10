# Byroo Tasks

## Milestone Checklist

### Phase 1 - Discovery and Planning
- [x] Define product scope and MVP limits
- [x] Select stack and architecture
- [x] Draft PRD, architecture, DB schema, setup/deploy docs
- [x] Create decisions log

### Phase 2 - Project Setup
- [x] Initialize Next.js + TypeScript + Tailwind
- [x] Install core dependencies
- [x] Create env templates
- [x] Set up base folders and shared libs

### Phase 3 - Data Model and Infrastructure
- [x] Create SQL schema and seed scripts
- [ ] Configure Supabase project buckets and run SQL
- [x] Implement Supabase client/server/admin utilities
- [x] Implement plan and theme config

### Phase 4 - Auth and Dashboard Foundation
- [x] Signup/login/reset pages
- [x] Protected dashboard layout
- [x] Onboarding flow and profile basics

### Phase 5 - Core MVP Features
- [x] Public profile by username route
- [x] Links CRUD with ordering and active toggle
- [x] Portfolio CRUD
- [x] Services CRUD
- [x] Theme selection and branding toggle
- [x] Avatar upload support

### Phase 6 - Plan Limits and Billing
- [x] Feature-gate helpers
- [x] Billing abstraction interface
- [x] Stripe provider implementation scaffold
- [x] Checkout / billing portal endpoints
- [x] Subscription sync webhook endpoint

### Phase 7 - Analytics
- [x] Profile view tracking endpoint
- [x] Link click tracking endpoint
- [x] Dashboard analytics summary

### Phase 8 - Polish
- [x] Responsive pages and dashboard navigation
- [x] Basic validation and error messaging
- [x] Metadata defaults for SEO
- [x] Empty/loading states for main views

### Phase 9 - QA and Docs
- [ ] Run Supabase SQL in a live project
- [ ] Connect Stripe keys and verify webhook signatures
- [ ] End-to-end smoke test with real auth + billing
- [x] Finalize README and setup/deploy docs

## Dependencies
- Phase 3 depends on Supabase project credentials.
- Phase 6 depends on Stripe product/price setup.
- Phase 7 depends on analytics table existence.

## Next Up
1. Execute `supabase/schema.sql` and `supabase/seed.sql` in Supabase SQL editor.
2. Configure env vars from `.env.example`.
3. Run local smoke tests for auth, profile publish, and billing entry.
