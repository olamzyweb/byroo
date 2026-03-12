-- 20260312_social_proof_block.sql

create table if not exists public.social_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok')),
  username text not null,
  display_name text,
  profile_image_url text,
  bio text,
  followers_count bigint,
  following_count bigint,
  content_count bigint,
  verified boolean not null default false,
  profile_url text not null,
  raw_payload jsonb,
  sync_status text not null default 'idle' check (sync_status in ('idle', 'syncing', 'success', 'error')),
  sync_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform)
);

create index if not exists idx_social_profiles_status_updated
  on public.social_profiles(sync_status, updated_at desc);

drop trigger if exists trg_social_profiles_updated_at on public.social_profiles;
create trigger trg_social_profiles_updated_at before update on public.social_profiles
for each row execute function public.set_updated_at();

alter table public.social_profiles enable row level security;

drop policy if exists "social profiles own all" on public.social_profiles;
create policy "social profiles own all"
on public.social_profiles for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
