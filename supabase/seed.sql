insert into public.themes (key, name, is_pro, tokens) values
('byroo-light', 'Byroo Light', false, '{"bg":"#f7f8f8","card":"#ffffff","text":"#0f172a","muted":"#64748b","accent":"#0ea5e9"}'::jsonb),
('byroo-sunset', 'Sunset Pro', true, '{"bg":"#fff7ed","card":"#ffffff","text":"#7c2d12","muted":"#9a3412","accent":"#ea580c"}'::jsonb),
('byroo-forest', 'Forest Pro', true, '{"bg":"#f0fdf4","card":"#ffffff","text":"#14532d","muted":"#166534","accent":"#16a34a"}'::jsonb)
on conflict (key) do update
set name = excluded.name,
    is_pro = excluded.is_pro,
    tokens = excluded.tokens;

-- Optional demo rows:
-- replace USER_UUID and username before running.
-- insert into public.profiles (id, email, username, display_name, bio, plan, onboarded)
-- values ('USER_UUID', 'demo@byroo.space', 'democreator', 'Demo Creator', 'Creative studio owner', 'free', true)
-- on conflict (id) do nothing;
