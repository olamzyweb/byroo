# Setup Guide

## Prerequisites
- Node.js 20+
- npm
- Supabase project
- Stripe account (optional for billing test)

## 1. Install dependencies
```bash
npm install
```

## 2. Configure environment
Copy `.env.example` to `.env.local` and fill values.

For Paystack billing:
- set `BILLING_PROVIDER=paystack`
- set `PAYSTACK_SECRET_KEY`
- set `PAYSTACK_PRO_PLAN_CODE`
- set `PAYSTACK_CALLBACK_URL` (for example: `http://localhost:3000/dashboard/billing`)
- optional debug: set `BILLING_WEBHOOK_DEBUG=true` to print webhook diagnostics in server logs

For Social Proof sync:
- set `SOCIAL_PROFILE_PROVIDER=searchapi`
- set `SEARCHAPI_API_KEY`
- optional: set `SEARCHAPI_BASE_URL` (default `https://www.searchapi.io`)
- optional alternate provider: `APIFY_TOKEN`, `APIFY_INSTAGRAM_ACTOR_ID`, `APIFY_TIKTOK_ACTOR_ID`
- set `SOCIAL_SYNC_CRON_SECRET`

## 3. Run SQL schema
In Supabase SQL editor, run:
1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/migrations/20260311_nigeria_whatsapp_vendor_extension.sql`
4. `supabase/migrations/20260312_profile_header_image.sql`
5. `supabase/migrations/20260312_catalog_storage_bucket.sql`
6. `supabase/migrations/20260312_admin_panel.sql`
7. `supabase/migrations/20260312_social_proof_block.sql`
8. `supabase/migrations/20260312_more_themes_and_free_catalog_limit.sql`

## 4. Create storage buckets
In Supabase Storage:
- `avatars` (public)
- `portfolio` (public)
- `catalog` (public)

## 5. Run app
```bash
npm run dev
```
Open `http://localhost:3000`.

## 6. Optional seed demo user
Use Supabase Auth dashboard to create a user, then run the seed inserts from `supabase/seed.sql` for demo data.

## 7. Bootstrap first admin user
After creating your own account, insert your auth user id into `admin_users`:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

Then open `/admin`.

## 8. Optional scheduled social refresh
Trigger stale social profile refresh:

- `GET /api/socials/refresh?secret=YOUR_SOCIAL_SYNC_CRON_SECRET`

or send:

- `Authorization: Bearer YOUR_SOCIAL_SYNC_CRON_SECRET`

## Local verification checklist
- Signup/login works
- Dashboard routes protected
- Can edit profile and set username
- Public page resolves on `/username`
- Link click tracking increments analytics
- Free plan limits enforced at 5 links and 3 portfolio items
- Paystack checkout opens and redirects back to billing page
