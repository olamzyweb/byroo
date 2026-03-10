# Deployment Guide

## Recommended Target
- Vercel for Next.js app
- Supabase for database/auth/storage
- Stripe for billing

## Steps
1. Push repo to GitHub.
2. Import project into Vercel.
3. Add environment variables from `.env.example` to Vercel project.
4. Set Stripe webhook endpoint to:
   - `https://your-domain.com/api/billing/webhook`
5. Deploy.

## Post-deploy checks
- Login + dashboard access
- Public profile loading by username
- Analytics event inserts
- Stripe checkout + webhook subscription update

## Rollback plan
- Keep SQL migrations versioned in `supabase/schema.sql`.
- If deploy fails, roll back to previous Vercel deployment.
- Avoid destructive DB changes without backup.

## Future hardening
- Add CI checks (typecheck/lint/test).
- Move SQL to migration tooling (Supabase CLI/Prisma migrate).
- Add domain-specific monitoring and alerting.
