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

## 3. Run SQL schema
In Supabase SQL editor, run:
1. `supabase/schema.sql`
2. `supabase/seed.sql`

## 4. Create storage buckets
In Supabase Storage:
- `avatars` (public)
- `portfolio` (public)

## 5. Run app
```bash
npm run dev
```
Open `http://localhost:3000`.

## 6. Optional seed demo user
Use Supabase Auth dashboard to create a user, then run the seed inserts from `supabase/seed.sql` for demo data.

## Local verification checklist
- Signup/login works
- Dashboard routes protected
- Can edit profile and set username
- Public page resolves on `/username`
- Link click tracking increments analytics
- Free plan limits enforced at 5 links and 3 portfolio items
