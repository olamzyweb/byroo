-- 20260312_catalog_storage_bucket.sql

insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do nothing;
