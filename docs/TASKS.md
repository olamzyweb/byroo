# Byroo Tasks

## Existing MVP (Complete)
- [x] Auth, dashboard, links, portfolio, services, themes, billing scaffold, analytics

## Nigeria WhatsApp-Vendor Extension Roadmap

### Phase A - Product Catalog
- [x] Add `catalog_items` schema and RLS
- [x] Add catalog CRUD server actions
- [x] Add `/dashboard/catalog` management page
- [x] Render catalog on public page
- [x] Enforce free vs pro catalog limits

### Phase B - Smart WhatsApp CTA
- [x] Add reusable WhatsApp helper
- [x] Add global profile WhatsApp settings page
- [x] Add item-specific WhatsApp prefilled messages
- [x] Add service-specific WhatsApp prefilled messages

### Phase C - Services / Price List Upgrade
- [x] Extend services schema: CTA type, availability, WhatsApp prefill
- [x] Update service dashboard form and cards
- [x] Update public rendering for WhatsApp-first service inquiries

### Phase D - Business Info Blocks
- [x] Add business info fields in profile schema
- [x] Add `/dashboard/business` page
- [x] Render location/maps/delivery/hours/toggles on public page

### Phase E - Social + Trust Blocks
- [x] Add social fields (Instagram, TikTok, Facebook)
- [x] Add testimonials table and CRUD page (`/dashboard/reviews`)
- [x] Render reviews and trusted badge on public page

### Phase F - Plan Gating Extension
- [x] Add plan limits for catalog/services/testimonials
- [x] Enforce new limits in server actions
- [x] Reflect limits in docs and product positioning

### Phase G - Public Storefront Redesign
- [x] Reorder page sections to storefront flow
- [x] Keep mobile-first structure and WhatsApp actions prominent

### Phase H - Dashboard UX Extension
- [x] Add new dashboard pages: catalog, business info, reviews, WhatsApp settings
- [x] Extend sidebar navigation

### Phase I - Documentation
- [x] Update `docs/PRD.md`
- [x] Update `docs/ARCHITECTURE.md`
- [x] Update `docs/DB_SCHEMA.md`
- [x] Update `docs/TASKS.md`
- [x] Update `docs/DECISIONS.md`
- [x] Update `README.md`

## Admin Panel Roadmap (Internal Ops)

### Phase J - Admin Access Control
- [x] Add `admin_users` table
- [x] Add `requireAdminUser` server guard
- [x] Add protected `/admin` route group and navigation

### Phase K - Monitoring Surfaces
- [x] Add `/admin` overview with platform KPI cards
- [x] Add `/admin/users` user management surface
- [x] Add `/admin/subscriptions` billing sync monitor + manual sync action
- [x] Add `/admin/analytics` platform engagement summaries
- [x] Add `/admin/system` storage + config + audit activity view

### Phase L - Admin Auditability
- [x] Add `admin_audit_logs` table
- [x] Log admin actions for plan/admin access/sync operations
- [x] Show recent audit events in system page

## Social Proof Block Roadmap

### Phase M - Data Model + Infrastructure
- [x] Add `social_profiles` table with unique `(user_id, platform)`
- [x] Add indexes, trigger, and RLS policy
- [x] Add migration `20260312_social_proof_block.sql`

### Phase N - Provider Abstraction + Sync
- [x] Add provider-agnostic social profile interface
- [x] Add first provider implementation (SearchAPI-first Instagram/TikTok)
- [x] Add normalized sync service with safe error handling
- [x] Add scheduled stale refresh endpoint (`/api/socials/refresh`)

### Phase O - Dashboard Social Proof Manager
- [x] Add `/dashboard/socials` page
- [x] Add connect/update/disconnect actions
- [x] Add manual refresh action and sync status/error visibility
- [x] Add plan gating (Free: 1 card, Pro: 2 cards)

### Phase P - Public Social Proof Cards
- [x] Add cached social profile fetch to public page data loader
- [x] Add mobile-first social proof card section on `/[username]`
- [x] Add compact stats, verification badge, and profile CTA
- [x] Gracefully handle missing/fallback fields

## Next Up
1. Run `supabase/migrations/20260312_social_proof_block.sql`.
2. Add provider env vars (`APIFY_TOKEN`, actor ids, sync secret).
3. Smoke test social flows: connect, sync, manual refresh, public rendering, cron refresh.
