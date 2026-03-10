# Byroo Database Schema

## Tables

### profiles
- `id uuid primary key` references `auth.users(id)`
- `email text not null unique`
- `username text not null unique`
- `display_name text not null`
- `bio text`
- `avatar_url text`
- `whatsapp_number text`
- `whatsapp_prefill text`
- `theme_key text not null default 'byroo-light'`
- `branding_hidden boolean not null default false`
- `plan text not null default 'free'` (`free` | `pro`)
- `onboarded boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### subscriptions
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null` references `profiles(id)`
- `provider text not null` (`stripe`)
- `provider_customer_id text`
- `provider_subscription_id text`
- `status text not null`
- `plan_key text not null default 'pro_monthly'`
- `price_id text`
- `current_period_end timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### links
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null` references `profiles(id)`
- `title text not null`
- `url text not null`
- `type text not null default 'website'`
- `is_active boolean not null default true`
- `sort_order int not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### portfolio_items
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null` references `profiles(id)`
- `title text not null`
- `description text`
- `image_url text`
- `external_url text`
- `is_active boolean not null default true`
- `sort_order int not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### services
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null` references `profiles(id)`
- `name text not null`
- `description text`
- `starting_price text`
- `cta_text text not null default 'Contact me'`
- `cta_url text`
- `is_active boolean not null default true`
- `sort_order int not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### themes
- `key text primary key`
- `name text not null`
- `is_pro boolean not null default false`
- `tokens jsonb not null`

### analytics_events
- `id uuid primary key default gen_random_uuid()`
- `profile_user_id uuid not null` references `profiles(id)`
- `event_type text not null` (`profile_view` | `link_click`)
- `link_id uuid` references `links(id)`
- `referrer_host text`
- `ip_hash text`
- `user_agent_hash text`
- `created_at timestamptz not null default now()`

## Storage Buckets
- `avatars` (public read)
- `portfolio` (public read)

## RLS Overview
- Users can read/write only their own rows in user-owned tables.
- Public read for `themes` and public page content via API/server queries.
- Analytics insert only via server APIs (service role path).

## Indexes
- `profiles(username)` unique
- `links(user_id, sort_order)`
- `portfolio_items(user_id, sort_order)`
- `services(user_id, sort_order)`
- `analytics_events(profile_user_id, created_at)`
