-- 20260312_admin_panel.sql

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

create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at desc);
create index if not exists idx_admin_audit_logs_action on public.admin_audit_logs(action);

alter table public.admin_users enable row level security;
alter table public.admin_audit_logs enable row level security;
