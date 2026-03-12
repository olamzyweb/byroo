# Byroo Database Schema

## Existing Core Tables
- `profiles`
- `subscriptions`
- `links`
- `portfolio_items`
- `services`
- `themes`
- `analytics_events`
- `social_profiles`
- `admin_users`
- `admin_audit_logs`

## Extended Tables / Fields (Nigeria WhatsApp-Vendor)

### profiles (extended)
Additional fields:
- `header_image_url text`
- `business_location text`
- `google_maps_url text`
- `delivery_info text`
- `opening_hours text`
- `nationwide_delivery boolean`
- `in_store_pickup boolean`
- `instagram_url text`
- `tiktok_url text`
- `facebook_url text`
- `trusted_badge_text text`

### services (extended)
Additional fields:
- `cta_type text` (`whatsapp` | `external`)
- `whatsapp_prefill text`
- `availability_status text` (`available` | `limited` | `unavailable`)

### catalog_items (new)
- `id uuid primary key`
- `user_id uuid` -> `profiles(id)`
- `name text`
- `image_url text`
- `price text`
- `short_description text`
- `category text`
- `availability_status text`
- `cta_type text` (`order_whatsapp` | `inquire_whatsapp`)
- `cta_text text`
- `whatsapp_prefill text`
- `is_active boolean`
- `sort_order int`
- timestamps

### testimonials (new)
- `id uuid primary key`
- `user_id uuid` -> `profiles(id)`
- `customer_name text`
- `review_text text`
- `rating int (1-5)`
- `is_featured boolean`
- `sort_order int`
- timestamps

### social_profiles (new)
- `id uuid primary key`
- `user_id uuid` -> `profiles(id)`
- `platform text` (`instagram` | `tiktok`)
- `username text`
- `display_name text`
- `profile_image_url text`
- `bio text`
- `followers_count bigint`
- `following_count bigint`
- `content_count bigint`
- `verified boolean`
- `profile_url text`
- `raw_payload jsonb`
- `sync_status text` (`idle` | `syncing` | `success` | `error`)
- `sync_error text`
- `last_synced_at timestamptz`
- timestamps
- unique `(user_id, platform)`

## RLS
User-owned all-access policies for:
- `links`
- `portfolio_items`
- `services`
- `catalog_items`
- `testimonials`

## Indexes
- `idx_catalog_user_order (user_id, sort_order)`
- `idx_testimonials_user_order (user_id, sort_order)`
- `idx_admin_audit_logs_created_at (created_at desc)`
- `idx_admin_audit_logs_action (action)`
- `idx_social_profiles_status_updated (sync_status, updated_at desc)`

## Admin Tables

### admin_users
- `user_id uuid` -> `profiles(id)` (PK)
- `created_at timestamptz`

Purpose:
- Explicit allow-list for admin panel access.

### admin_audit_logs
- `id uuid` (PK)
- `actor_user_id uuid` -> `profiles(id)`
- `action text`
- `target_user_id uuid` -> `profiles(id)` nullable
- `metadata jsonb`
- `created_at timestamptz`

Purpose:
- Track high-impact internal operations (plan overrides, admin grants, sync actions).
- Existing indexes retained.

## Migration
Run:
- `supabase/migrations/20260311_nigeria_whatsapp_vendor_extension.sql`
- `supabase/migrations/20260312_social_proof_block.sql`

Then keep `supabase/schema.sql` as canonical full schema snapshot.
