-- Migration: i18n JSONB — Convert text columns to multilingual JSONB
-- Executed: 2026-07-15
--
-- Converts programs.name/destination/level/includes and email_templates.subject/body_html
-- from TEXT to JSONB with {fr, en, pl} keys. Preserves all existing data.

-- ============================================================
-- PROGRAMS TABLE
-- ============================================================

-- Step 1: Add temporary JSONB columns
ALTER TABLE programs ADD COLUMN IF NOT EXISTS name_jsonb JSONB;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS destination_jsonb JSONB;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS level_jsonb JSONB;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS includes_jsonb JSONB;

-- Step 2: Migrate name (existing text → all 3 languages identical)
UPDATE programs SET name_jsonb = jsonb_build_object('fr', name, 'en', name, 'pl', name);

-- Step 3: Migrate destination (translate known values)
UPDATE programs SET destination_jsonb = jsonb_build_object(
  'fr',
    CASE destination
      WHEN 'Imsouane, Morocco' THEN 'Imsouane, Maroc'
      WHEN 'Tamraght, Morocco' THEN 'Tamraght, Maroc'
      WHEN 'Taghazout, Morocco' THEN 'Taghazout, Maroc'
      ELSE destination
    END,
  'en', destination,
  'pl',
    CASE destination
      WHEN 'Imsouane, Morocco' THEN 'Imsouane, Maroko'
      WHEN 'Tamraght, Morocco' THEN 'Tamraght, Maroko'
      WHEN 'Taghazout, Morocco' THEN 'Taghazout, Maroko'
      ELSE destination
    END
);

-- Step 4: Migrate level (translate known values)
UPDATE programs SET level_jsonb = jsonb_build_object(
  'fr',
    CASE level
      WHEN 'Beginner' THEN 'Débutant'
      WHEN 'Intermediate' THEN 'Intermédiaire'
      WHEN 'Advanced' THEN 'Avancé'
      ELSE level
    END,
  'en', level,
  'pl',
    CASE level
      WHEN 'Beginner' THEN 'Początkujący'
      WHEN 'Intermediate' THEN 'Średniozaawansowany'
      WHEN 'Advanced' THEN 'Zaawansowany'
      ELSE level
    END
);

-- Step 5: Migrate includes (convert each string to {fr,en,pl} object)
CREATE OR REPLACE FUNCTION migrate_includes(arr JSONB)
RETURNS JSONB AS $$
DECLARE
  elem TEXT;
  result JSONB := '[]'::JSONB;
  item JSONB;
  fr_trans JSONB := '{
    "7 nights accommodation": "7 nuits d''hébergement",
    "Daily breakfast & dinner": "Petit-déjeuner et dîner quotidiens",
    "2 surf sessions per day": "2 sessions de surf par jour",
    "All equipment provided": "Tout l''équipement fourni",
    "Certified surf instructors": "Instructeurs de surf certifiés",
    "Small groups (max 8 people)": "Petits groupes (max 8 personnes)",
    "Expert coaching & surf guiding": "Coaching expert et guidage surf",
    "Video analysis sessions": "Sessions d''analyse vidéo",
    "Daily surf forecasting briefing": "Briefing quotidien des prévisions de surf",
    "All meals included": "Tous les repas inclus",
    "Airport transfers": "Transferts aéroport",
    "Access to premium surf spots": "Accès aux spots de surf premium",
    "Daily transport to secret spots": "Transport quotidien vers les spots secrets",
    "Sunrise surf sessions": "Sessions de surf au lever du soleil",
    "Luxury riad accommodation": "Hébergement en riad de luxe",
    "All meals & transfers": "Tous les repas et transferts",
    "Pro surf photography": "Photographie de surf professionnelle"
  }'::JSONB;
  pl_trans JSONB := '{
    "7 nights accommodation": "7 nocy zakwaterowania",
    "Daily breakfast & dinner": "Codzienne śniadanie i kolacja",
    "2 surf sessions per day": "2 sesje surfowania dziennie",
    "All equipment provided": "Cały sprzęt zapewniony",
    "Certified surf instructors": "Certyfikowani instruktorzy surfingu",
    "Small groups (max 8 people)": "Małe grupy (max 8 osób)",
    "Expert coaching & surf guiding": "Ekspercki coaching i przewodnictwo surfingowe",
    "Video analysis sessions": "Sesje analizy wideo",
    "Daily surf forecasting briefing": "Codzienny briefing prognoz surfingowych",
    "All meals included": "Wszystkie posiłki wliczone",
    "Airport transfers": "Transfery lotniskowe",
    "Access to premium surf spots": "Dostęp do premium spotów surfingowych",
    "Daily transport to secret spots": "Codzienny transport do sekretnych spotów",
    "Sunrise surf sessions": "Sesje surfowania o wschodzie słońca",
    "Luxury riad accommodation": "Zakwaterowanie w luksusowym riadzie",
    "All meals & transfers": "Wszystkie posiłki i transfery",
    "Pro surf photography": "Profesjonalna fotografia surfingowa"
  }'::JSONB;
BEGIN
  IF arr IS NULL OR jsonb_typeof(arr) <> 'array' THEN
    RETURN '[]'::JSONB;
  END IF;
  FOR elem IN SELECT jsonb_array_elements_text(arr)
  LOOP
    item := jsonb_build_object(
      'fr', COALESCE(fr_trans ->> elem, elem),
      'en', elem,
      'pl', COALESCE(pl_trans ->> elem, elem)
    );
    result := result || jsonb_build_array(item);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

UPDATE programs SET includes_jsonb = migrate_includes(includes);

-- Step 6: Drop old columns and rename new ones
ALTER TABLE programs DROP COLUMN IF EXISTS name;
ALTER TABLE programs DROP COLUMN IF EXISTS destination;
ALTER TABLE programs DROP COLUMN IF EXISTS level;
ALTER TABLE programs DROP COLUMN IF EXISTS includes;

ALTER TABLE programs RENAME COLUMN name_jsonb TO name;
ALTER TABLE programs RENAME COLUMN destination_jsonb TO destination;
ALTER TABLE programs RENAME COLUMN level_jsonb TO level;
ALTER TABLE programs RENAME COLUMN includes_jsonb TO includes;

ALTER TABLE programs ALTER COLUMN name SET NOT NULL;

DROP FUNCTION IF EXISTS migrate_includes(JSONB);

-- ============================================================
-- EMAIL TEMPLATES TABLE
-- ============================================================

ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS subject_jsonb JSONB;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS body_html_jsonb JSONB;

UPDATE email_templates SET
  subject_jsonb = COALESCE(
    jsonb_build_object('fr', subject, 'en', subject, 'pl', subject),
    '{"fr":"","en":"","pl":""}'::JSONB
  ),
  body_html_jsonb = COALESCE(
    jsonb_build_object('fr', body_html, 'en', body_html, 'pl', body_html),
    '{"fr":"","en":"","pl":""}'::JSONB
  );

ALTER TABLE email_templates DROP COLUMN IF EXISTS subject;
ALTER TABLE email_templates DROP COLUMN IF EXISTS body_html;

ALTER TABLE email_templates RENAME COLUMN subject_jsonb TO subject;
ALTER TABLE email_templates RENAME COLUMN body_html_jsonb TO body_html;
