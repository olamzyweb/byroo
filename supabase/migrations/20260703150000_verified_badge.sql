-- 20260703150000_verified_badge.sql

alter table public.profiles add column if not exists badge_revoked boolean not null default false;
