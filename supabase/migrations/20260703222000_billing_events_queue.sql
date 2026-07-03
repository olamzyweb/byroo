create type billing_event_status as enum ('pending', 'processing', 'processed', 'failed');

create table public.billing_events (
    id uuid not null default gen_random_uuid(),
    provider text not null,
    event_type text not null,
    reference text,
    customer_id text,
    payload jsonb not null,
    status billing_event_status not null default 'pending',
    error_message text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    
    constraint billing_events_pkey primary key (id)
);

-- Enable RLS
alter table public.billing_events enable row level security;

-- Admin access only
create policy "Admins can manage billing events"
    on public.billing_events
    for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Create trigger for updated_at
create trigger set_billing_events_updated_at
    before update on public.billing_events
    for each row
    execute function public.set_current_timestamp_updated_at();

-- Index for cron job
create index billing_events_status_idx on public.billing_events (status);
