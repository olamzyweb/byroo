-- 20260312_more_themes_and_free_catalog_limit.sql

insert into public.themes (key, name, is_pro, tokens) values
('byroo-light', 'Byroo Light', false, '{"bg":"#f7f8f8","card":"#ffffff","text":"#0f172a","muted":"#64748b","accent":"#0ea5e9"}'::jsonb),
('byroo-sunset', 'Sunset Pro', true, '{"bg":"#fff7ed","card":"#ffffff","text":"#7c2d12","muted":"#9a3412","accent":"#ea580c"}'::jsonb),
('byroo-forest', 'Forest Pro', true, '{"bg":"#f0fdf4","card":"#ffffff","text":"#14532d","muted":"#166534","accent":"#16a34a"}'::jsonb),
('byroo-ocean', 'Ocean Pro', true, '{"bg":"#eff6ff","card":"#ffffff","text":"#1e3a8a","muted":"#1d4ed8","accent":"#0284c7"}'::jsonb),
('byroo-sand', 'Sand Pro', true, '{"bg":"#fffbeb","card":"#ffffff","text":"#854d0e","muted":"#a16207","accent":"#f59e0b"}'::jsonb),
('byroo-charcoal', 'Charcoal Pro', true, '{"bg":"#0f172a","card":"#111827","text":"#e5e7eb","muted":"#94a3b8","accent":"#38bdf8"}'::jsonb)
on conflict (key) do update
set name = excluded.name,
    is_pro = excluded.is_pro,
    tokens = excluded.tokens;
