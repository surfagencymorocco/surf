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

-- Email templates table (one per status, i18n: subject/body_html use JSONB {fr,en,pl})
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL UNIQUE,
  subject JSONB DEFAULT '{"fr":"","en":"","pl":""}',
  body_html JSONB DEFAULT '{"fr":"","en":"","pl":""}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Edge Function: send-email (deployed via Management API)
-- Uses nodemailer in Deno to send via Gmail SMTP
-- URL: https://gfcpxdxfshopclfmnfnk.supabase.co/functions/v1/send-email

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

-- Programs table (i18n: name/destination/level/includes use JSONB {fr,en,pl})
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name JSONB NOT NULL,
  destination JSONB,
  level JSONB,
  price INTEGER,
  dates JSONB DEFAULT '[]',
  includes JSONB DEFAULT '[]',
  image TEXT DEFAULT '',
  active BOOLEAN DEFAULT true
);

-- Seed programs (JSONB format)
INSERT INTO programs (name, destination, level, price, dates, includes, image) VALUES
(
  '{"fr":"IMSOUANE SURF CAMP","en":"IMSOUANE SURF CAMP","pl":"IMSOUANE SURF CAMP"}',
  '{"fr":"Imsouane, Maroc","en":"Imsouane, Morocco","pl":"Imsouane, Maroko"}',
  '{"fr":"Débutant","en":"Beginner","pl":"Początkujący"}',
  550,
  '["May 1–8","Jun 10–17","Jul 5–12","Aug 10–17"]',
  '[
    {"fr":"7 nuits d''hébergement","en":"7 nights accommodation","pl":"7 nocy zakwaterowania"},
    {"fr":"Petit-déjeuner et dîner quotidiens","en":"Daily breakfast & dinner","pl":"Codzienne śniadanie i kolacja"},
    {"fr":"2 sessions de surf par jour","en":"2 surf sessions per day","pl":"2 sesje surfowania dziennie"},
    {"fr":"Tout l''équipement fourni","en":"All equipment provided","pl":"Cały sprzęt zapewniony"},
    {"fr":"Instructeurs de surf certifiés","en":"Certified surf instructors","pl":"Certyfikowani instruktorzy surfingu"},
    {"fr":"Petits groupes (max 8 personnes)","en":"Small groups (max 8 people)","pl":"Małe grupy (max 8 osób)"}
  ]',
  'images/the-magic-bay.jpg'
),
(
  '{"fr":"TAMRAGHT SURF CAMP","en":"TAMRAGHT SURF CAMP","pl":"TAMRAGHT SURF CAMP"}',
  '{"fr":"Tamraght, Maroc","en":"Tamraght, Morocco","pl":"Tamraght, Maroko"}',
  '{"fr":"Intermédiaire","en":"Intermediate","pl":"Średniozaawansowany"}',
  650,
  '["Mar 15–22","Apr 10–17","Oct 20–27"]',
  '[
    {"fr":"7 nuits d''hébergement","en":"7 nights accommodation","pl":"7 nocy zakwaterowania"},
    {"fr":"Coaching expert et guidage surf","en":"Expert coaching & surf guiding","pl":"Ekspercki coaching i przewodnictwo surfingowe"},
    {"fr":"Sessions d''analyse vidéo","en":"Video analysis sessions","pl":"Sesje analizy wideo"},
    {"fr":"Briefing quotidien des prévisions de surf","en":"Daily surf forecasting briefing","pl":"Codzienny briefing prognoz surfingowych"},
    {"fr":"Tous les repas inclus","en":"All meals included","pl":"Wszystkie posiłki wliczone"},
    {"fr":"Transferts aéroport","en":"Airport transfers","pl":"Transfery lotniskowe"}
  ]',
  'images/2024-11-05.webp'
),
(
  '{"fr":"TAGHAZOUT SURF TRIP","en":"TAGHAZOUT SURF TRIP","pl":"TAGHAZOUT SURF TRIP"}',
  '{"fr":"Taghazout, Maroc","en":"Taghazout, Morocco","pl":"Taghazout, Maroko"}',
  '{"fr":"Avancé","en":"Advanced","pl":"Zaawansowany"}',
  750,
  '["Dec 5–12","Jan 10–17","Feb 5–12"]',
  '[
    {"fr":"Accès aux spots de surf premium","en":"Access to premium surf spots","pl":"Dostęp do premium spotów surfingowych"},
    {"fr":"Transport quotidien vers les spots secrets","en":"Daily transport to secret spots","pl":"Codzienny transport do sekretnych spotów"},
    {"fr":"Sessions de surf au lever du soleil","en":"Sunrise surf sessions","pl":"Sesje surfowania o wschodzie słońca"},
    {"fr":"Hébergement en riad de luxe","en":"Luxury riad accommodation","pl":"Zakwaterowanie w luksusowym riadzie"},
    {"fr":"Tous les repas et transferts","en":"All meals & transfers","pl":"Wszystkie posiłki i transfery"},
    {"fr":"Photographie de surf professionnelle","en":"Pro surf photography","pl":"Profesjonalna fotografia surfingowa"}
  ]',
  'images/2024-12-10.webp'
);
