-- 20260311_paystack_billing_extension.sql

alter table public.subscriptions add column if not exists provider_subscription_token text;
alter table public.subscriptions add column if not exists provider_reference text;

create index if not exists idx_subscriptions_provider_reference
  on public.subscriptions(provider, provider_reference);
