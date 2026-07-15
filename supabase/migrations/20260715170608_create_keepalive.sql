-- Migration: Create keepalive table for Supabase Free Tier anti-pause
-- Executed: 2026-07-15
--
-- Switches api/ping.js from /auth/v1/health (no DB activity) to
-- a real PostgREST query on public.keepalive (generates DB activity).

CREATE TABLE IF NOT EXISTS public.keepalive (
  id serial primary key,
  created_at timestamptz default now()
);

INSERT INTO public.keepalive DEFAULT VALUES;

ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_anon_select
ON public.keepalive
FOR SELECT
TO anon
USING (true);
