-- Byroo schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text unique,
  display_name text not null default 'New Byroo User',
  bio text,
  avatar_url text,
  whatsapp_number text,
  whatsapp_prefill text,
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
  cta_url text,
  is_active boolean not null default true,
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

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_links_user_order on public.links(user_id, sort_order);
create index if not exists idx_portfolio_user_order on public.portfolio_items(user_id, sort_order);
create index if not exists idx_services_user_order on public.services(user_id, sort_order);
create index if not exists idx_events_profile_created on public.analytics_events(profile_user_id, created_at);

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

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.links enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.services enable row level security;
alter table public.themes enable row level security;
alter table public.analytics_events enable row level security;

-- profiles policies
create policy if not exists "profiles select own"
on public.profiles for select
using (auth.uid() = id);

create policy if not exists "profiles update own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy if not exists "profiles insert own"
on public.profiles for insert
with check (auth.uid() = id);

-- public read by username done via server role; keep authenticated read own only.

-- generic user-owned table policies
create policy if not exists "links own all"
on public.links for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "portfolio own all"
on public.portfolio_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "services own all"
on public.services for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "subscriptions own read"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy if not exists "themes read all"
on public.themes for select
using (true);

create policy if not exists "analytics own read"
on public.analytics_events for select
using (auth.uid() = profile_user_id);
