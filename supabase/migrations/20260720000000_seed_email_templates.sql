-- Migration: Seed default email templates
-- Created: 2026-07-20
-- Idempotent: uses ON CONFLICT DO NOTHING
--
-- Three default templates for: pending (auto-reply), confirmed, cancelled
-- Each template supports French (fr), English (en), Polish (pl) via JSONB

INSERT INTO email_templates (status, subject, body_html)
VALUES
(
  'pending',
  '{
    "fr": "Votre demande - SurfAgencyMorocco",
    "en": "Your booking request - SurfAgencyMorocco",
    "pl": "Twoja rezerwacja - SurfAgencyMorocco"
  }'::jsonb,
  '{
    "fr": "<h1>Bonjour {{name}}</h1><p>Merci pour votre demande de reservation.</p><p><strong>Destination :</strong> {{destination}}<br><strong>Date :</strong> {{date}}</p><p>Statut : <strong>{{status}}</strong></p><p>Nous vous contacterons dans les 24 heures.</p><p>A bientot,<br>SurfAgencyMorocco</p>",
    "en": "<h1>Hello {{name}}</h1><p>Thank you for your booking request.</p><p><strong>Destination:</strong> {{destination}}<br><strong>Date:</strong> {{date}}</p><p>Status: <strong>{{status}}</strong></p><p>We will contact you within 24 hours.</p><p>See you soon,<br>SurfAgencyMorocco</p>",
    "pl": "<h1>Czesc {{name}}</h1><p>Dziekujemy za Twoja rezerwacje.</p><p><strong>Destynacja:</strong> {{destination}}<br><strong>Data:</strong> {{date}}</p><p>Status: <strong>{{status}}</strong></p><p>Skontaktujemy sie w ciagu 24 godzin.</p><p>Do zobaczenia,<br>SurfAgencyMorocco</p>"
  }'::jsonb
),
(
  'confirmed',
  '{
    "fr": "Reservation confirmee - SurfAgencyMorocco",
    "en": "Booking confirmed - SurfAgencyMorocco",
    "pl": "Rezerwacja potwierdzona - SurfAgencyMorocco"
  }'::jsonb,
  '{
    "fr": "<h1>Bonjour {{name}}</h1><p>Votre reservation est <strong>confirmee</strong>.</p><p><strong>Destination :</strong> {{destination}}<br><strong>Date :</strong> {{date}}</p><p>A bientot au Maroc !</p>",
    "en": "<h1>Hello {{name}}</h1><p>Your booking is <strong>confirmed</strong>.</p><p><strong>Destination:</strong> {{destination}}<br><strong>Date:</strong> {{date}}</p><p>See you soon in Morocco!</p>",
    "pl": "<h1>Czesc {{name}}</h1><p>Twoja rezerwacja zostala <strong>potwierdzona</strong>.</p><p><strong>Destynacja:</strong> {{destination}}<br><strong>Data:</strong> {{date}}</p><p>Do zobaczenia w Maroku!</p>"
  }'::jsonb
),
(
  'cancelled',
  '{
    "fr": "Reservation annulee - SurfAgencyMorocco",
    "en": "Booking cancelled - SurfAgencyMorocco",
    "pl": "Rezerwacja anulowana - SurfAgencyMorocco"
  }'::jsonb,
  '{
    "fr": "<h1>Bonjour {{name}}</h1><p>Votre reservation a ete <strong>annulee</strong>.</p><p>Contactez-nous pour plus d''informations.</p>",
    "en": "<h1>Hello {{name}}</h1><p>Your booking has been <strong>cancelled</strong>.</p><p>Contact us for more information.</p>",
    "pl": "<h1>Czesc {{name}}</h1><p>Twoja rezerwacja zostala <strong>anulowana</strong>.</p><p>Skontaktuj sie z nami po wiecej informacji.</p>"
  }'::jsonb
)
ON CONFLICT (status) DO NOTHING;
