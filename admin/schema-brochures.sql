-- Run this in Supabase SQL Editor to add brochure PDF support to programs
-- Extends existing programs table with brochure URLs

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS brochure_fr TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS brochure_en TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS brochure_pl TEXT DEFAULT '';
