# SurfAgencyMorocco

**Static HTML landing page + admin panel.** No build tools, no package manager, no server.

## Project structure

```
SurfAgencyMorocco/
├── index.html               ← Public page (no inline styles/scripts)
├── admin/
│   ├── index.html           ← Login (Supabase Auth email/password)
│   ├── dashboard.html       ← Reservations, Programs, Email config
│   ├── admin.css            ← All admin styles
│   └── schema.sql           ← SQL reference (tables, RLS, seed data)
├── assets/
│   ├── css/                 ← 11 CSS files, one per section
│   │   └── main.css         ← Variables, reset, shared classes
│   ├── js/                  ← 8 IIFE files (no ES modules)
│   │   ├── supabase-client.js  ← Supabase client + CRUD + sendEmail
│   │   ├── svg-loader.js       ← Fetches sprite.svg, injects into <body>
│   │   ├── form.js             ← Booking form → Supabase + auto-pending-email
│   │   └── programs.js         ← Loads programs from Supabase (fallback to static HTML)
│   └── icons/sprite.svg     ← All SVG symbols externalized
├── .env                     ← Supabase credentials (gitignored)
└── env.example              ← Template for .env
```

## Key rules

- **No inline `style=""` in index.html** — use BEM/utility classes. dashboard.html (admin) has JS-generated inline styles and is exempt.
- **No inline `<script>`** — all JS loaded with `<script defer>`. The only exception is the admin pages' inline auth/form JS (kept in the HTML).
- **All JS is IIFE** (not ES modules). Files communicate via `window.SupabaseAPI`.
- **SVG sprite** loaded by `svg-loader.js` → `fetch('assets/icons/sprite.svg')` → injected into `<body>`. Reference icons with `<svg><use href="#icon-{name}"/></svg>`.
- **Programs section**: static HTML fallback. If programs are synced from Supabase, `programs.js` replaces the grid dynamically.

## Supabase

- **URL**: `https://njdywnbjgyovgmfxhyeu.supabase.co`
- **Anon key** hardcoded in `supabase-client.js:3` (duplicated in `.env` for reference only)
- **JS client**: loaded via CDN `https://unpkg.com/@supabase/supabase-js@2` (dynamic `<script>` injection). Other JS files check `window._supabase` or `window.SupabaseAPI` to retry if not loaded.
- **Tables**: `reservations`, `programs`, `email_settings`, `email_templates`
- **Storage**: bucket `program-images` (public read, authenticated write)
- **RLS**: anon can INSERT to `reservations`. All other table operations require authenticated user. Storage: authenticated can upload/update/delete, public can select.
- **Auth**: email/password. Admin creds: `admin@surfagencymorocco.com` / `Saskia34%`

## Edge Function (`send-email`)

- **URL**: `/functions/v1/send-email` (deployed on Supabase)
- **Runtime**: Deno (npm:nodemailer via `npm:nodemailer@6.9.8`)
- **SMTP**: Gmail App Password required (not personal password). Credentials passed in request body — Edge Function does NOT read the database.
- **CORS**: Allows all origins.
- **Verify JWT**: `true` (but uses anon key in `Authorization` header)
- **Deploy caveat**: Source must be UTF-8 **without BOM**. Use `[System.Text.UTF8Encoding]::new($false)` in PowerShell.
- **`sendEmail()` in JS** uses raw `fetch()` (NOT `supabase.functions.invoke()`) to avoid SDK version issues. Header: `Authorization: Bearer <anon_key>`.

## Email flow

- **New booking** (`form.js`): after `submitReservation()` succeeds → fetches `email_settings` + `email_templates` → finds template with `status='pending'` → replaces `{{name}}`, `{{destination}}`, `{{date}}`, `{{status}}` → calls `sendEmail()`.
- **Status change** (`dashboard.html`): admin selects Confirm/Cancel from dropdown → `updateReservation()` → same template flow with status-specific template.
- Silently skips if no SMTP configured (no error shown to user).

## CSS loading order (index.html)

```html
main.css → animations.css → nav.css → hero.css → destinations.css → seasons.css → programs.css → daily.css → why.css → testimonials.css → booking.css → footer.css
```

## JS loading order (index.html, all `<script defer>`)

```html
supabase-client.js → svg-loader.js → hero.js → nav.js → reveal.js → testimonials.js → programs.js → form.js
```

## Fonts

Google Fonts: **Bebas Neue**, **DM Sans**, **Playfair Display**

## Dev commands

- Open `index.html` in browser (file:// or static server)
- No build, no test, no lint
