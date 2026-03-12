-- 20260311_nigeria_whatsapp_vendor_extension.sql

alter table public.profiles add column if not exists business_location text;
alter table public.profiles add column if not exists google_maps_url text;
alter table public.profiles add column if not exists delivery_info text;
alter table public.profiles add column if not exists opening_hours text;
alter table public.profiles add column if not exists nationwide_delivery boolean not null default false;
alter table public.profiles add column if not exists in_store_pickup boolean not null default false;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists tiktok_url text;
alter table public.profiles add column if not exists facebook_url text;
alter table public.profiles add column if not exists trusted_badge_text text;

alter table public.services add column if not exists cta_type text not null default 'whatsapp';
alter table public.services add column if not exists whatsapp_prefill text;
alter table public.services add column if not exists availability_status text not null default 'available';

alter table public.services drop constraint if exists services_cta_type_check;
alter table public.services add constraint services_cta_type_check check (cta_type in ('whatsapp', 'external'));
alter table public.services drop constraint if exists services_availability_status_check;
alter table public.services add constraint services_availability_status_check check (availability_status in ('available', 'limited', 'unavailable'));

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

create index if not exists idx_catalog_user_order on public.catalog_items(user_id, sort_order);
create index if not exists idx_testimonials_user_order on public.testimonials(user_id, sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_catalog_updated_at on public.catalog_items;
create trigger trg_catalog_updated_at before update on public.catalog_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.catalog_items enable row level security;
alter table public.testimonials enable row level security;

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
