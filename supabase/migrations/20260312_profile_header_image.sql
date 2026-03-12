-- 20260312_profile_header_image.sql

alter table public.profiles add column if not exists header_image_url text;
