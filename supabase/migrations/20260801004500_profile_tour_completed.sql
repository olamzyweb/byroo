-- Add tour_completed column to profiles table with default value false
ALTER TABLE public.profiles ADD COLUMN if not exists tour_completed boolean not null default false;
