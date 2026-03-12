# Admin Panel Guide

## Purpose
Internal console for monitoring growth, subscriptions, system health, and handling support tasks.

## Routes
- `/admin`: KPI overview
- `/admin/users`: user search + plan/admin access management
- `/admin/subscriptions`: billing sync diagnostics + manual Paystack sync action
- `/admin/analytics`: platform-level views/click summaries
- `/admin/system`: storage counters, runtime flags, and admin audit feed

## Access Control
- Access is granted via `public.admin_users`.
- Route protection is enforced server-side by `requireAdminUser()` in `src/lib/auth.ts`.

## Required Migration
- `supabase/migrations/20260312_admin_panel.sql`

## Bootstrap
Insert the first admin user:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

## Auditing
Admin operations are written to `public.admin_audit_logs`:
- `set_plan`
- `grant_admin_access`
- `revoke_admin_access`
- `sync_subscription`
