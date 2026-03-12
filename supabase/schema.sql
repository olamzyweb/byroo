-- Byroo schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text unique,
  display_name text not null default 'New Byroo User',
  bio text,
  avatar_url text,
  header_image_url text,
  whatsapp_number text,
  whatsapp_prefill text,
  business_location text,
  google_maps_url text,
  delivery_info text,
  opening_hours text,
  nationwide_delivery boolean not null default false,
  in_store_pickup boolean not null default false,
  instagram_url text,
  tiktok_url text,
  facebook_url text,
  trusted_badge_text text,
  theme_key text not null default 'byroo-light',
  branding_hidden boolean not null default false,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_subscription_id text,
  provider_subscription_token text,
  provider_reference text,
  status text not null default 'inactive',
  plan_key text not null default 'pro_monthly',
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_subscription_id)
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  type text not null default 'website',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  external_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  starting_price text,
  cta_text text not null default 'Contact me',
  cta_type text not null default 'whatsapp' check (cta_type in ('whatsapp', 'external')),
  cta_url text,
  whatsapp_prefill text,
  availability_status text not null default 'available' check (availability_status in ('available', 'limited', 'unavailable')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  image_url text,
  price text,
  short_description text,
  category text,
  availability_status text not null default 'available' check (availability_status in ('available', 'limited', 'unavailable')),
  cta_type text not null default 'order_whatsapp' check (cta_type in ('order_whatsapp', 'inquire_whatsapp')),
  cta_text text not null default 'Order on WhatsApp',
  whatsapp_prefill text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_name text not null,
  review_text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  is_featured boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.themes (
  key text primary key,
  name text not null,
  is_pro boolean not null default false,
  tokens jsonb not null
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('profile_view', 'link_click')),
  link_id uuid references public.links(id) on delete set null,
  referrer_host text,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_links_user_order on public.links(user_id, sort_order);
create index if not exists idx_portfolio_user_order on public.portfolio_items(user_id, sort_order);
create index if not exists idx_services_user_order on public.services(user_id, sort_order);
create index if not exists idx_catalog_user_order on public.catalog_items(user_id, sort_order);
create index if not exists idx_testimonials_user_order on public.testimonials(user_id, sort_order);
create index if not exists idx_events_profile_created on public.analytics_events(profile_user_id, created_at);
create index if not exists idx_social_profiles_status_updated on public.social_profiles(sync_status, updated_at desc);
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at desc);
create index if not exists idx_admin_audit_logs_action on public.admin_audit_logs(action);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_links_updated_at on public.links;
create trigger trg_links_updated_at before update on public.links
for each row execute function public.set_updated_at();

drop trigger if exists trg_portfolio_updated_at on public.portfolio_items;
create trigger trg_portfolio_updated_at before update on public.portfolio_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists trg_catalog_updated_at on public.catalog_items;
create trigger trg_catalog_updated_at before update on public.catalog_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists trg_social_profiles_updated_at on public.social_profiles;
create trigger trg_social_profiles_updated_at before update on public.social_profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.links enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.services enable row level security;
alter table public.catalog_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.themes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.social_profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_audit_logs enable row level security;

-- profiles policies
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
on public.profiles for insert
with check (auth.uid() = id);

-- public read by username done via server role; keep authenticated read own only.

-- generic user-owned table policies
drop policy if exists "links own all" on public.links;
create policy "links own all"
on public.links for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "portfolio own all" on public.portfolio_items;
create policy "portfolio own all"
on public.portfolio_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "services own all" on public.services;
create policy "services own all"
on public.services for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "catalog own all" on public.catalog_items;
create policy "catalog own all"
on public.catalog_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "testimonials own all" on public.testimonials;
create policy "testimonials own all"
on public.testimonials for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "subscriptions own read" on public.subscriptions;
create policy "subscriptions own read"
on public.subscriptions for select
using (auth.uid() = user_id);

drop policy if exists "themes read all" on public.themes;
create policy "themes read all"
on public.themes for select
using (true);

drop policy if exists "analytics own read" on public.analytics_events;
create policy "analytics own read"
on public.analytics_events for select
using (auth.uid() = profile_user_id);

drop policy if exists "social profiles own all" on public.social_profiles;
create policy "social profiles own all"
on public.social_profiles for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
