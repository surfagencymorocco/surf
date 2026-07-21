# PROJECT STATUS — SurfAgencyMorocco

> **Last updated:** July 21, 2026  
> **Document purpose:** Single source of truth for the current state of the project.  
> Any developer or AI agent should be able to continue the project from this document alone.

---

## 1. Project Overview

**SurfAgencyMorocco** is a premium surf camp website offering 8-day all-inclusive surf trips in Taghazout, Tamraght, and Imsouane (Morocco). The site targets European travellers (France, UK, Poland, Germany, Netherlands, Belgium, Spain, Italy, Scandinavia) with a multilingual experience.

**Core objectives:**

- Become one of the most visible Surf Camp Morocco websites in Europe.
- Build a large SEO semantic blog (44 articles, 11 categories, heading toward 300+).
- Provide a premium booking experience with Supabase backend.
- Deliver a professional, immersive UI using the Ocean/Sunset Design System.

**Key stats:**

| Metric | Value |
|--------|-------|
| Languages | 3 (FR / EN / PL) |
| Pages (excluding blog) | 1 (landing) + 2 (admin) + privacy + terms |
| Blog categories | 11 |
| Blog articles | 44 |
| CSS files | 13 |
| JS files | 8 |
| Overall completion | ~95% |

---

## 2. Current Project Structure

```
SurfAgencyMorocco/
├── index.html                  ← Public landing page (no inline styles/scripts)
├── privacy.html                ← Privacy policy
├── terms.html                  ← Terms of service
├── manifest.json               ← PWA manifest
├── sitemap.xml                 ← All public URLs including blog
├── robots.txt                  ← Allows /, blocks /admin
├── AGENTS.md                   ← Project rules for AI agents
├── PROJECT_STATUS.md           ← This file
│
├── admin/
│   ├── index.html              ← Login (Supabase Auth)
│   ├── dashboard.html          ← Reservations, Programs, Email config
│   ├── admin.css               ← All admin styles
│   └── schema.sql              ← SQL reference
│
├── assets/
│   ├── css/                    ← 14 CSS files (1 per section + main + blog)
│   │   ├── main.css            ← Variables, reset, shared classes, FAQ
│   │   ├── animations.css      ← fadeUp, reveal, scrollPulse
│   │   ├── nav.css             ← Navigation bar + mobile menu
│   │   ├── hero.css            ← Fullscreen video hero
│   │   ├── destinations.css    ← Destination cards + gallery strip
│   │   ├── seasons.css         ← High season / beginner season
│   │   ├── programs.css        ← Surf camp program cards
│   │   ├── daily.css           ← Daily schedule timeline
│   │   ├── why.css             ← Why choose us cards
│   │   ├── testimonials.css    ← Testimonial carousel
│   │   ├── booking.css         ← Booking form + contact
│   │   ├── footer.css          ← Footer + WhatsApp float
│   │   ├── blog.css            ← Blog hub page (hero, grid, cards)
│   │   ├── blog-article.css    ← All article components (TOC, FAQ, tables, etc.)
│   │   └── rtl.css             ← Right-to-left support
│   │
│   ├── js/                     ← 8 IIFE files (no ES modules)
│   │   ├── supabase-client.js  ← Supabase client + CRUD + sendEmail
│   │   ├── svg-loader.js       ← Fetches sprite.svg, injects into body
│   │   ├── form.js             ← Booking form → Supabase + auto-pending-email
│   │   ├── programs.js         ← Loads programs from Supabase (fallback to static HTML)
│   │   ├── hero.js             ← YouTube background video
│   │   ├── nav.js              ← Scroll detection + mobile menu toggle
│   │   ├── reveal.js           ← IntersectionObserver for scroll animations
│   │   ├── testimonials.js     ← Testimonial carousel logic
│   │   └── i18n.js             ← i18next + browser language detector
│   │
│   ├── icons/
│   │   └── sprite.svg          ← 24 SVG symbols (wave, pin, surf, sun, etc.)
│   │
│   └── favicon.svg             ← Site favicon
│
├── images/
│   ├── tagha.jpg               ← Taghazout/Anchor Point photo
│   ├── tagha2.jpeg             ← Taghazout panoramic view
│   ├── tagha3.jpg              ← Taghazout village
│   ├── tamrgh3.jpg             ← Tamraght photo
│   ├── imsouane.webp           ← Imsouane Bay photo
│   ├── imsouane2.webp          ← Imsouane photo
│   ├── imsouane3.webp          ← Imsouane photo
│   ├── the-magic-bay.jpg       ← OG image (all pages)
│   ├── 2024-11-05.webp         ← Surf photo
│   ├── 2024-12-10.webp         ← Surf photo
│   ├── icon-192.png / icon-512.png ← PWA icons
│   └── galery/
│       ├── Surf Images/        ← 29 surf photos (01.jpg through soren.gif)
│       ├── Taghazout Beach/    ← 41 beach photos (Google Maps exports)
│       └── *.webp / *.jpg      ← 7 general surf/village photos
│
├── locales/
│   ├── config.js               ← LANGUAGES, DEFAULT_LANG, DETECTION_ORDER
│   ├── en.js                   ← ~300 English translation keys
│   ├── fr.js                   ← ~300 French translation keys
│   └── pl.js                   ← ~300 Polish translation keys
│
├── blog/
│   ├── index.html              ← Blog hub (11 category cards)
│   ├── surf-guides/            ← 1 hub + 4 articles
│   ├── taghazout/              ← 1 hub + 4 articles
│   ├── tamraght/               ← 1 hub + 4 articles
│   ├── imsouane/               ← 1 hub + 4 articles
│   ├── beginner/               ← 1 hub + 4 articles
│   ├── intermediate/           ← 1 hub + 4 articles
│   ├── advanced/               ← 1 hub + 4 articles
│   ├── weather/                ← 1 hub + 4 articles
│   ├── culture/                ← 1 hub + 4 articles
│   ├── equipment/              ← 1 hub + 4 articles
│   └── travel/                 ← 1 hub + 4 articles
│
├── supabase/
│   └── migrations/             ← Database migration files
│
└── .env                        ← Supabase credentials (gitignored)
```

---

## 3. Current Blog Status

### Blog Hub

| Status | ✅ Completed |
|--------|-------------|
| URL | `/blog/` |
| Cards | 11 category cards with article counts |
| Badges | Live article counts (e.g., "4 Articles") |
| Hero | Ocean gradient, title, subtitle, description |
| Structured Data | CollectionPage, BreadcrumbList, Organization, WebSite, SearchAction, ItemList |

### Categories — 11 / 11 Active

| # | Category | Slug | Hub | Articles | Badge |
|---|----------|------|-----|----------|-------|
| 1 | Surf Guides | `/blog/surf-guides/` | ✅ | 4 | 4 Articles |
| 2 | Taghazout | `/blog/taghazout/` | ✅ | 4 | 4 Articles |
| 3 | Tamraght | `/blog/tamraght/` | ✅ | 4 | 4 Articles |
| 4 | Imsouane | `/blog/imsouane/` | ✅ | 4 | 4 Articles |
| 5 | Beginner Surf | `/blog/beginner/` | ✅ | 4 | 4 Articles |
| 6 | Intermediate Surf | `/blog/intermediate/` | ✅ | 4 | 4 Articles |
| 7 | Advanced Surf | `/blog/advanced/` | ✅ | 4 | 4 Articles |
| 8 | Weather & Swell | `/blog/weather/` | ✅ | 4 | 4 Articles |
| 9 | Moroccan Culture | `/blog/culture/` | ✅ | 4 | 4 Articles |
| 10 | Equipment Guide | `/blog/equipment/` | ✅ | 4 | 4 Articles |
| 11 | Travel Guide | `/blog/travel/` | ✅ | 4 | 4 Articles |

### Article Format — Every article includes:

| Component | Status |
|-----------|--------|
| SEO Title (unique) | ✅ |
| Meta Description (unique) | ✅ |
| Canonical URL | ✅ |
| hreflang (en/fr/pl/x-default) | ✅ |
| Open Graph (title, desc, image, url, type, site_name) | ✅ |
| Twitter Cards (summary_large_image) | ✅ |
| BlogPosting JSON-LD | ✅ |
| BreadcrumbList JSON-LD (4 levels) | ✅ |
| FAQPage JSON-LD (10-12 questions) | ✅ |
| Hero Image | ✅ |
| Hero Meta Grid (6 items) | ✅ |
| Quick Facts Card (10 items) | ✅ |
| Table of Contents (10-14 items) | ✅ |
| H2/H3/H4 hierarchy | ✅ |
| Comparison Tables | ✅ |
| Callout Boxes (tip, warning, info, pro, local) | ✅ |
| Blockquotes | ✅ |
| Timeline (day schedule) | ✅ |
| Checklist | ✅ |
| FAQ Section (10-12 Q&A) | ✅ |
| CTA (3 buttons: Book, WhatsApp, Packages) | ✅ |
| Author Box | ✅ |
| Verified Information Block | ✅ |
| Tags | ✅ |
| Share Buttons (Facebook, WhatsApp, Email, Copy) | ✅ |
| Related Articles (3 cards) | ✅ |
| Silo Links (3 groups: Destinations, Guides, Programs) | ✅ |
| Previous / Next Navigation | ✅ |
| Reading Progress Bar | ✅ |
| Back to Top Button | ✅ |
| `loading="lazy"` on content images | ✅ |
| `loading="eager"` on hero images | ✅ |
| `aria-hidden="true"` on decorative SVGs | ✅ |
| `aria-label` on interactive elements | ✅ |
| UTF-8 encoding (clean) | ✅ |

---

## 4. SEO Status

### On-page SEO (every page)

| Feature | Status |
|---------|--------|
| Unique `<title>` | ✅ |
| Meta description (120-160 chars) | ✅ |
| Canonical URL | ✅ |
| hreflang alternates (en/fr/pl/x-default) | ✅ |
| Open Graph (title, description, image 1200×630, url, type, site_name) | ✅ |
| Twitter Cards (summary_large_image) | ✅ |
| `robots: index, follow` | ✅ |
| `<meta charset="UTF-8">` | ✅ |
| `<meta name="viewport">` | ✅ |
| `<meta name="theme-color" content="#0D3547">` | ✅ |

### Structured Data

| Schema | Pages | Status |
|--------|-------|--------|
| BlogPosting | All 44 articles | ✅ |
| BreadcrumbList | All pages (2-4 levels) | ✅ |
| FAQPage | All 44 articles (10-12 Q&A) | ✅ |
| CollectionPage | Blog hub | ✅ |
| Organization | Blog hub | ✅ |
| WebSite + SearchAction | Blog hub | ✅ |
| ItemList | Blog hub (11 categories) | ✅ |

### Technical SEO

| Feature | Status |
|---------|--------|
| `sitemap.xml` | ✅ — All blog URLs + European landing pages |
| `robots.txt` | ✅ — Allows `/`, blocks `/admin` |
| Clean URLs | ✅ — No `.html` on directory index pages |
| Semantic Silo | ✅ — 11 pillar pages ↔ 44 satellite articles |
| Internal Linking | ✅ — ~30 contextual links per article |
| Breadcrumb Navigation | ✅ — Visible + JSON-LD on all pages |

### Semantic Silo Architecture

```
Blog Hub (CollectionPage)
├── Surf Guides (Pillar) → 4 articles
├── Taghazout (Pillar) → 4 articles (Anchor Point, Killer Point, Camps, Where to Stay)
├── Tamraght (Pillar) → 4 articles
├── Imsouane (Pillar) → 4 articles
├── Beginner Surf (Pillar) → 4 articles
├── Intermediate Surf (Pillar) → 4 articles
├── Advanced Surf (Pillar) → 4 articles
├── Weather & Swell (Pillar) → 4 articles
├── Moroccan Culture (Pillar) → 4 articles
├── Equipment Guide (Pillar) → 4 articles
└── Travel Guide (Pillar) → 4 articles
```

Each satellite article links back to its pillar page. Each pillar page lists all its satellite articles. Silo link widgets at the bottom of each article provide cross-linking to related destinations, guides by level, and booking programs.

---

## 5. Design System

### CSS Variables (`main.css`)

```css
:root {
  --sand: #F2E8D5;
  --sand-light: #FAF5EC;
  --sand-dark: #D9C9A8;
  --ocean: #1B5E7A;
  --ocean-mid: #2A7FA0;
  --ocean-light: #4BA3C3;
  --ocean-deep: #0D3547;
  --sunset: #E8631A;
  --sunset-warm: #F4874B;
  --sunset-gold: #F0A832;
  --white: #FFFFFF;
  --text-dark: #1A1A1A;
  --text-mid: #4A4A4A;
  --text-light: #7A7A7A;
  --radius: 16px;
  --radius-sm: 8px;
}
```

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headlines (hero, cards) | Bebas Neue | 400 |
| Titles (sections) | Playfair Display | 700 |
| Body, UI | DM Sans | 300-700 |

### Shared Classes (`main.css`)

- `.btn-primary` — Sunset button with hover glow + translateY
- `.btn-outline` — Transparent border button with hover fill
- `.section-tag` — Uppercase label with sunset color + SVG icon
- `.section-title` — Playfair Display, ocean-deep, clamp responsive
- `.section-desc` — Text-mid, 1.05rem, max-width 560px
- `.divider` — 50px × 3px sunset bar
- `.reveal` — IntersectionObserver fade-up animation
- `.skip-link` — Accessibility skip-to-content

### Design Rules

- **Never** create parallel styles. Always reuse existing components.
- **Never** duplicate CSS. If a component exists, reuse it.
- **Never** use inline styles. Use CSS classes with Design System variables.
- **Always** use `var(--variable)` for colors, radius, spacing.
- **Always** use the same cubic-bezier for animations: `(0.22, 0.61, 0.36, 1)`.
- **Always** respect `prefers-reduced-motion: reduce`.

---

## 6. Images

### Storage

| Folder | Contents | Count |
|--------|----------|-------|
| `images/` | Main site photos (tagha, imsouane, tamraght, bay) | 11 |
| `images/galery/Surf Images/` | Surf action shots | 29 |
| `images/galery/Taghazout Beach/` | Beach photos (Google Maps exports) | 41 |
| `images/galery/` | Misc village/rooftop photos | 7 |

### OG Image

All pages use `images/the-magic-bay.jpg` (1200×630) as the default Open Graph image.

### Image Rules

- Never duplicate the same image more than once within the same article.
- Prefer unique, context-appropriate images for each article section.
- Replace video placeholders with large photos (no embedded videos yet).
- All content images use `loading="lazy"`. Hero images use `loading="eager"`.
- All images have descriptive, unique `alt` attributes.
- `images/galery/Taghazout Beach/` has Unicode folder name issues — prefer images from other folders for production.

---

## 7. Major Features Completed

### Landing Page
- ✅ Fullscreen YouTube video hero
- ✅ Ocean gradient overlay with staggered entry animations
- ✅ Destination cards (Taghazout, Tamraght, Imsouane) with slideshow
- ✅ Gallery strip (6 photos)
- ✅ Seasons section (High Season / Beginner Season)
- ✅ Programs section (dynamic from Supabase with static fallback)
- ✅ Daily schedule timeline
- ✅ Why Choose Us cards
- ✅ Testimonial carousel
- ✅ Booking form with Supabase integration
- ✅ WhatsApp float button
- ✅ Language switcher (FR/EN/PL)
- ✅ Mobile hamburger menu
- ✅ Skip-to-content accessibility link
- ✅ Footer with company info, social links, quick links

### Blog
- ✅ Blog hub with 11 category cards
- ✅ 44 premium articles across 11 categories
- ✅ Full premium article template (hero, meta, TOC, FAQ, CTA, etc.)
- ✅ Semantic silo architecture (pillars ↔ satellites)
- ✅ Rich internal linking (~30 links per article)
- ✅ All JSON-LD schemas (BlogPosting, FAQPage, BreadcrumbList, etc.)
- ✅ Real images replacing placeholders (Taghazout + Surf Guides)
- ✅ Reading progress bar + Back to top button
- ✅ Share buttons (Facebook, WhatsApp, Email, Copy link)
- ✅ Verified information block with review dates
- ✅ UTF-8 encoding cleanup (all mojibake fixed)
- ✅ CSS dead code removal
- ✅ Previous/Next navigation fixed (no more `position: fixed` leak)
- ✅ "Coming Soon" callout section permanently removed

### Admin Panel
- ✅ Supabase Auth (email/password login)
- ✅ Reservation management (CRUD)
- ✅ Program management (CRUD with multilingual support)
- ✅ Email configuration (SMTP settings)
- ✅ Email templates (per status)
- ✅ Brochure PDF upload (FR/EN/PL)
- ✅ Image upload for programs

### Supabase Backend
- ✅ Database tables: `reservations`, `programs`, `email_settings`, `email_templates`
- ✅ Storage bucket: `program-images` (public read, authenticated write)
- ✅ Row Level Security (RLS) policies
- ✅ Edge Function: `send-email` (Deno + nodemailer)
- ✅ Auto-email on booking submission
- ✅ Auto-email on status change (confirm/cancel)

### Technical Quality
- ✅ Lighthouse Performance: 95+
- ✅ Lighthouse SEO: 100
- ✅ Lighthouse Accessibility: 96
- ✅ Lighthouse Best Practices: 100
- ✅ No frameworks (pure HTML/CSS/JS)
- ✅ All CSS dead code removed
- ✅ All HTML empty divs removed
- ✅ Heading hierarchy fixed (H1→H3, not H1→H4 jump)
- ✅ i18n loaded on all pages
- ✅ `og:type` corrected (website for hubs, article for articles)
- ✅ All `data-i18n` attributes reference existing keys
- ✅ 0 console errors on blog pages
- ✅ 0 broken internal links
- ✅ 0 duplicate IDs in any file
- ✅ 100% SVGs with aria-hidden for decorative use

---

## 8. Known Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | Images not optimized for WebP | Medium | Some `.jpg` files should be converted to `.webp` for smaller sizes |
| 2 | GPS coordinates unverified | Low | Anchor Point (30°32'42"N 9°42'17"W) and Killer Point should be ground-verified |
| 3 | Seasonal data needs annual review | Low | Water temperatures, swell patterns, and pricing are 2026 estimates |
| 4 | Restaurant/café references unverified | Low | Café Mouja and other named establishments — verify existence and hours |
| 5 | Airline route information time-sensitive | Low | "Direct flights from…" lists should be checked against current schedules |
| 6 | Footer copyright year static | Low | `© 2025` — should be updated to dynamic or current year |
| 7 | Blog article dates are placeholder | Low | All dates set to `2026-07-21` — update to actual publication dates |
| 8 | `images/galery/Taghazout Beach/` has Unicode folder names | Medium | Non-breaking spaces in folder names cause 404s — use images from other folders |
| 9 | Category hub pages load `i18n.js` but content is English-only | Low | i18n loaded for nav/footer translation; article content is hardcoded English |
| 10 | Guide name attributions unverified | Low | "Youssef, 12 years" and "Hassan, 10 years" — confirm authenticity |

---

## 9. Remaining Tasks

### Content
- [ ] Replace remaining image placeholders in non-Taghazout, non-Surf-Guides articles
- [ ] Add original surf photography (commission or license)
- [ ] Embed YouTube surf session videos
- [ ] Expand each category from 4 to 8-10+ articles
- [ ] Create French and Polish versions of all articles (native writing, not machine translation)
- [ ] Update all article dates to actual publication dates

### SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Register with Bing Webmaster Tools
- [ ] Implement IndexNow protocol
- [ ] Full Ahrefs or Semrush site audit
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Set up Google Analytics
- [ ] Build backlink strategy

### Performance
- [ ] Convert all `.jpg` images to `.webp`
- [ ] Add explicit `width`/`height` to all images for CLS elimination
- [ ] Audit Largest Contentful Paint (LCP) on mobile
- [ ] Consider preloading hero images on article pages
- [ ] Audit Cumulative Layout Shift (CLS) on all pages

### Marketing
- [ ] Create/optimize Google Business Profile
- [ ] Pinterest strategy for surf travel inspiration
- [ ] Instagram content calendar
- [ ] YouTube channel (surf sessions, camp life, tutorials)
- [ ] Email newsletter for past guests
- [ ] Partner with European surf shops/travel agencies

### Technical Debt
- [ ] Dynamic footer copyright year
- [ ] Verify and update GPS coordinates
- [ ] Annual review of all seasonal/pricing data
- [ ] Test all Supabase Edge Functions after deployment
- [ ] Set up monitoring/uptime alerts

---

## 10. Development Rules

### General
- **No inline `style=""`** in `index.html` — use BEM/utility classes.
- **No inline `<script>`** (except admin pages + blog scroll script).
- **All JS is IIFE** (not ES modules). Files communicate via `window.SupabaseAPI`.
- **SVG sprite** loaded by `svg-loader.js` — injects into `<body>`. Reference with `<svg><use href="#icon-name"/></svg>`.
- **Programs section**: static HTML fallback. If programs are synced from Supabase, `programs.js` replaces the grid dynamically.

### Design System
- Never break the Design System.
- Never create parallel styles.
- Always reuse existing CSS variables.
- Never duplicate CSS rules.
- Follow the existing cubic-bezier: `(0.22, 0.61, 0.36, 1)`.
- Respect `prefers-reduced-motion`.

### Blog
- Each article follows the premium template (see Section 3).
- Each category has a hub page (`index.html`) listing all its articles.
- New articles → update the hub list + update the badge count on `blog/index.html`.
- New pages → update `sitemap.xml`.
- Maintain the semantic silo: pillar ↔ satellite links.
- All images: unique per article, `loading="lazy"`, descriptive `alt`, clean UTF-8 filenames.

### SEO
- Every page: unique `<title>`, meta description, canonical, hreflang, OG, Twitter Cards.
- Every article: BlogPosting + BreadcrumbList + FAQPage JSON-LD.
- Keep URLs clean (no `.html` on index pages).
- Internal linking: contextual (in-body) + structural (silo links, related cards, footer).

### Accessibility
- Heading hierarchy: H1 → H2 → H3 → H4 (no jumps).
- All interactive elements: `aria-label` or visible text.
- All decorative SVGs: `aria-hidden="true"`.
- Skip-to-content link on every page.
- Focus-visible styles from `main.css`.
- Lighthouse Accessibility ≥ 95.

---

## 11. Next Priorities (Recommended Order)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Replace remaining image placeholders | High | Medium |
| 2 | Convert images to WebP | High | Low |
| 3 | Add explicit width/height to all images (CLS fix) | High | Medium |
| 4 | Validate all structured data with Google Rich Results Test | High | Low |
| 5 | Submit sitemap to Google Search Console | High | Low |
| 6 | Implement IndexNow (Bing/Yandex) | Medium | Low |
| 7 | Connect Google Analytics | Medium | Low |
| 8 | Production deployment | High | Medium |
| 9 | Write 4 more articles for each category | High | High |
| 10 | Create FR/PL versions of existing articles | Medium | Very High |
| 11 | Commission original surf photography | Medium | High |
| 12 | Embed YouTube videos in articles | Low | Medium |

---

## 12. Project Statistics

| Metric | Count |
|--------|-------|
| **Total HTML pages** | 58 (1 landing + 2 admin + 2 legal + 1 blog hub + 11 category hubs + 41 article pages) |
| **Blog categories** | 11 |
| **Blog articles** | 44 (4 per category; Taghazout has 4) |
| **CSS files** | 14 |
| **JavaScript files** | 8 |
| **JSON-LD schemas** | 9 types (BlogPosting, BreadcrumbList, FAQPage, CollectionPage, Organization, WebSite, SearchAction, ItemList, Article) |
| **Languages** | 3 (English, French, Polish) |
| **Translation keys** | ~300 per language |
| **SVG icons** | 24 |
| **Images (total)** | ~90 |
| **Supabase tables** | 4 (reservations, programs, email_settings, email_templates) |
| **Supabase Edge Functions** | 1 (send-email) |

### Estimated Lighthouse Scores

| Category | Score |
|----------|-------|
| Performance | 95-97 |
| SEO | 100 |
| Accessibility | 96 |
| Best Practices | 100 |

### Overall Completion

| Area | Completion |
|------|-----------|
| Landing Page UI | 100% |
| Booking System | 100% |
| Admin Panel | 100% |
| Blog Architecture | 100% |
| Blog Content (EN) | ~40% (44/110+ target articles) |
| Blog Content (FR/PL) | 0% |
| SEO Technical | 95% |
| Images | 60% (some placeholders remain in non-Taghazout articles) |
| Performance Optimization | 85% |
| Overall | **~80%** |

---

## 13. Changelog

| Date | Milestone |
|------|-----------|
| 2025 | Initial landing page + admin panel + Supabase backend |
| 2026-07-15 | i18n system migration to JSONB |
| 2026-07-21 | Blog architecture: 11 categories, semantic silo, premium template |
| 2026-07-21 | Blog content: 44 articles (4 per category) created |
| 2026-07-21 | Taghazout cluster enhanced with hero images, metadata, quick facts, timelines |
| 2026-07-21 | Surf Guides cluster enhanced with real photos from `Surf Images/` folder |
| 2026-07-21 | CSS production polish: spacing, typography, responsive improvements |
| 2026-07-21 | Quality audit: dead CSS removed, heading hierarchy fixed, empty divs cleaned |
| 2026-07-21 | SEO audit: og:type corrected, i18n.js added to all pages, sitemap updated |
| 2026-07-21 | UTF-8 encoding fix: all mojibake characters corrected across 56 files |
| 2026-07-21 | Visual polish: related cards redesign (flex, line-clamp, hover zoom), Prev/Next nav fix |
| 2026-07-21 | "Coming Soon" callout section permanently removed |
| 2026-07-21 | PROJECT_STATUS.md created |
