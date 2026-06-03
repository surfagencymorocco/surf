-- Run this SQL in your Supabase dashboard: SQL Editor
-- To add image column to existing table:
-- ALTER TABLE programs ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';

-- Email settings table (single row)
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INTEGER DEFAULT 587,
  smtp_secure BOOLEAN DEFAULT false,
  smtp_user TEXT DEFAULT '',
  smtp_pass TEXT DEFAULT '',
  from_email TEXT DEFAULT '',
  from_name TEXT DEFAULT 'SurfAgencyMorocco',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Email templates table (one per status)
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL UNIQUE,
  subject TEXT DEFAULT '',
  body_html TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Edge Function: send-email (deployed via Management API)
-- Uses nodemailer in Deno to send via Gmail SMTP
-- URL: https://njdywnbjgyovgmfxhyeu.supabase.co/functions/v1/send-email

-- Storage bucket "program-images" (created via Management API)
-- RLS policies for storage.objects:
-- CREATE POLICY "authenticated_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'program-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "authenticated_update" ON storage.objects FOR UPDATE USING (bucket_id = 'program-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "authenticated_delete" ON storage.objects FOR DELETE USING (bucket_id = 'program-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "public_select" ON storage.objects FOR SELECT USING (bucket_id = 'program-images');

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  surf_level TEXT NOT NULL,
  destination TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Programs table
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  destination TEXT,
  level TEXT,
  price INTEGER,
  dates JSONB DEFAULT '[]',
  includes JSONB DEFAULT '[]',
  image TEXT DEFAULT '',
  active BOOLEAN DEFAULT true
);

-- Seed programs
INSERT INTO programs (name, destination, level, price, dates, includes, image) VALUES
('IMSOUANE SURF CAMP', 'Imsouane, Morocco', 'Beginner', 550,
  '["May 1–8","Jun 10–17","Jul 5–12","Aug 10–17"]',
  '["7 nights accommodation","Daily breakfast & dinner","2 surf sessions per day","All equipment provided","Certified surf instructors","Small groups (max 8 people)"]',
  'images/the-magic-bay.jpg'),
('TAMRAGHT SURF CAMP', 'Tamraght, Morocco', 'Intermediate', 650,
  '["Mar 15–22","Apr 10–17","Oct 20–27"]',
  '["7 nights accommodation","Expert coaching & surf guiding","Video analysis sessions","Daily surf forecasting briefing","All meals included","Airport transfers"]',
  'images/2024-11-05.webp'),
('TAGHAZOUT SURF TRIP', 'Taghazout, Morocco', 'Advanced', 750,
  '["Dec 5–12","Jan 10–17","Feb 5–12"]',
  '["Access to premium surf spots","Daily transport to secret spots","Sunrise surf sessions","Luxury riad accommodation","All meals & transfers","Pro surf photography"]',
  'images/2024-12-10.webp');
