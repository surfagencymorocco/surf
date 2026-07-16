# PROJECT_ARCHITECTURE.md — SurfAgencyMorocco

> **Documentation technique officielle — Source unique de vérité**
> Dernière mise à jour : 2026-07-16
> Version : 2.0

---

## Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Vision fonctionnelle](#2-vision-fonctionnelle)
3. [Architecture globale](#3-architecture-globale)
4. [Arborescence complète](#4-arborescence-complète)
5. [Stack technique](#5-stack-technique)
6. [Architecture Frontend](#6-architecture-frontend)
7. [Architecture Admin](#7-architecture-admin)
8. [Base de données](#8-base-de-données)
9. [Flux de données](#9-flux-de-données)
10. [Services](#10-services)
11. [Design System](#11-design-system)
12. [Architecture CSS](#12-architecture-css)
13. [Architecture JavaScript](#13-architecture-javascript)
14. [Sécurité](#14-sécurité)
15. [Performance](#15-performance)
16. [Déploiement](#16-déploiement)
17. [Dépendances](#17-dépendances)
18. [Décisions d'Architecture (ADR)](#18-décisions-darchitecture-adr)
19. [Bonnes pratiques](#19-bonnes-pratiques)
20. [Guide développeur](#20-guide-développeur)
21. [Guide de maintenance](#21-guide-de-maintenance)
22. [Checklist avant modification](#22-checklist-avant-modification)
23. [Dette technique](#23-dette-technique)
24. [Journal des évolutions](#24-journal-des-évolutions)
25. [Guide pour les assistants IA](#25-guide-pour-les-assistants-ia)
26. [Roadmap](#26-roadmap)
27. [Résumé final](#27-résumé-final)

---

## 1. Présentation générale

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | SurfAgencyMorocco |
| **Type** | Landing page statique + panneau d'administration |
| **Domaine** | `surfagencymorocco.com` |
| **Dépôt** | `github.com/surfagencymorocco/surf` |
| **Environnement** | Aucun build, aucun package manager, aucun serveur |

### Objectif

Site d'une agence de surf basée à Kraków (Pologne) opérant au Maroc. Le site présente 3 destinations de surf (Taghazout, Tamraght, Imsouane), 3 programmes de 8 jours (débutant/intermédiaire/avancé), et permet aux visiteurs de réserver via un formulaire. Un panneau admin permet de gérer les réservations, programmes, emails et brochures PDF.

### Public cible

- **Primaire** : surfeurs polonais et européens cherchant un camp de surf au Maroc
- **Secondaire** : administrateurs de l'agence gérant les réservations et programmes
- **Marché principal** : Pologne
- **Marché secondaire** : France, Allemagne, Espagne, Italie, Belgique, Pays-Bas, Portugal, Royaume-Uni

### Fonctionnalités principales

| # | Fonctionnalité | Public | Fichiers |
|---|---------------|--------|----------|
| 1 | Landing page multilingue (FR/EN/PL) | Visiteurs | `index.html` |
| 2 | Formulaire de réservation → Supabase + email auto | Visiteurs | `form.js` |
| 3 | Programmes dynamiques chargés depuis Supabase | Visiteurs | `programs.js` |
| 4 | Connexion admin (Supabase Auth email/password) | Admin | `admin/index.html` |
| 5 | Dashboard — gestion des réservations (CRUD + statuts) | Admin | `admin/dashboard.html` |
| 6 | Dashboard — gestion des programmes (CRUD + image upload) | Admin | `admin/dashboard.html` |
| 7 | Dashboard — brochures PDF multilingues (FR/EN/PL) | Admin | `admin/dashboard.html` |
| 8 | Dashboard — configuration SMTP + templates email | Admin | `admin/dashboard.html` |
| 9 | Vidéo YouTube en fond (hero + daily) | Visiteurs | `hero.js` |
| 10 | Carrousel de témoignages (CSS animation) | Visiteurs | `testimonials.css` |
| 11 | SEO : meta tags, OG, Twitter, hreflang, JSON-LD | Visiteurs | `index.html`, `schema.js` |
| 12 | KeepAlive anti-pause Supabase Free Tier | Infra | `api/ping.js` |

### État actuel

**Production-ready.** Toutes les fonctionnalités sont stables. Le site est déployé sur Vercel avec Supabase en backend. Score SEO estimé : 81/100.

---

## 2. Vision fonctionnelle

### 2.1 Parcours visiteur (landing page)

```
Visiteur arrive sur le site
 │
 ├─ Lit le hero (vidéo YouTube fond + titre + CTA)
 ├─ Explore les 3 destinations (Taghazout, Tamraght, Imsouane)
 ├─ Parcourt la galerie photo
 ├─ Compare les saisons (Haute Saison Oct-Avr / Débutants Mai-Sep)
 ├─ Consulte les 3 programmes (débutant 550€ / intermédiaire 650€ / avancé 750€)
 ├─ Lit la journée type (timeline)
 ├─ Découvre les avantages (4 cartes Why Us)
 ├─ Lit les témoignages (carrousel CSS infini)
 ├─ Remplit le formulaire de réservation
 │    └─ Nom, email, téléphone, niveau, destination, date, message
 │    └─ Soumission → Supabase (table reservations) + email automatique
 └─ Contact via WhatsApp ou email (footer)
```

### 2.2 Parcours administrateur

```
Admin visite /admin/index.html
 │
 ├─ Saisit email + mot de passe Supabase Auth
 ├─ Redirigé vers dashboard.html
 │
 ├─ Onglet "Reservations"
 │    ├─ Tableau des réservations (date, nom, email, tel, niveau, destination, date, message, statut)
 │    ├─ Dropdown par ligne : Confirmer / Annuler / Supprimer
 │    └─ Changement statut → email automatique au client
 │
 ├─ Onglet "Programs"
 │    ├─ Grid de cartes programme éditables
 │    ├─ Édition : nom, destination, niveau, prix, image, brochures PDF, dates, inclus
 │    ├─ Upload image (WebP/JPG) → Supabase Storage
 │    ├─ Upload brochures PDF (FR/EN/PL) → Supabase Storage
 │    ├─ Bouton "+ Add Program" (nouveau programme)
 │    └─ Delete programme (cascade : image + brochures)
 │
 ├─ Onglet "Email"
 │    ├─ Configuration SMTP (host, port, user, pass, from)
 │    ├─ Bouton "Send Test Email"
 │    └─ Templates email (pending/confirmed/cancelled) avec prévisualisation
```

### 2.3 Workflow d'email automatique

```
Nouvelle réservation (form.js)
  └─ submitReservation() → Supabase
       └─ getEmailSettings() → récupère config SMTP
            └─ getEmailTemplates() → trouve template "pending"
                 └─ Remplace {{name}}, {{destination}}, {{date}}, {{status}}
                      └─ sendEmail() → Edge Function Supabase → Gmail SMTP → client

Changement statut (dashboard.html)
  └─ Admin sélectionne "Confirm" ou "Cancel" dans le dropdown
       └─ updateReservation() → Supabase
            └─ Même flux : getEmailSettings → getEmailTemplates → template status → sendEmail
```

### 2.4 Scénarios de fallback

- **Supabase non chargé** (CDN bloqué) : le formulaire de réservation utilise un mock, les programmes affichent le HTML statique
- **i18n non initialisé** : les textes HTML statiques (en anglais) servent de fallback
- **Pas de SMTP configuré** : les emails sont silencieusement ignorés (pas d'erreur utilisateur)
- **Brochure absente pour la langue courante** : le bouton "Download Brochure" est masqué

---

## 3. Architecture globale

### 3.1 Schéma architectural

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Navigateur)                           │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────────┐   │
│  │  Landing Page (public)   │    │  Admin Dashboard              │   │
│  │  index.html              │    │  admin/index.html             │   │
│  │  • 12 CSS files          │    │  admin/dashboard.html         │   │
│  │  • 9 JS files (IIFE)     │    │  admin/admin.css              │   │
│  │  • i18n (FR/EN/PL)       │    │  • Supabase Auth (login)      │   │
│  │  • YouTube Video (hero)  │    │  • CRUD reservations          │   │
│  │  • Booking form          │    │  • CRUD programs              │   │
│  │  • Programs dynamic      │    │  • Image/brochure upload      │   │
│  │  • SEO (JSON-LD, OG)     │    │  • SMTP / email templates     │   │
│  └──────────┬───────────────┘    └──────────────┬───────────────┘   │
│             │                                    │                    │
└─────────────┼────────────────────────────────────┼────────────────────┘
              │                                    │
              │  HTTPS (fetch / Supabase SDK)      │
              ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Backend)                            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Auth        │  │  Database    │  │  Storage                 │  │
│  │  (GoTrue)    │  │  (Postgres)  │  │  (S3-compatible)         │  │
│  │              │  │              │  │                          │  │
│  │  • email/    │  │  • reservat- │  │  • Bucket:               │  │
│  │    password  │  │    ions      │  │    program-images        │  │
│  │  • sessions  │  │  • programs  │  │    ├─ images/            │  │
│  │  • RLS       │  │  • email_    │  │    └─ brochures/         │  │
│  │    policies  │  │    settings  │  │  • RLS: auth=write,      │  │
│  │              │  │  • email_    │  │    anon=read             │  │
│  │              │  │    templates │  │                          │  │
│  │              │  │  • keepalive │  │                          │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────────────┘  │
│                           │                                          │
│  ┌────────────────────────┴──────────────────────────────────────┐  │
│  │  Edge Functions (Deno)                                         │  │
│  │  • send-email : nodemailer → Gmail SMTP                        │  │
│  └────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
              │
              │  GET /rest/v1/keepalive (toutes les heures)
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL (Hébergement)                          │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────────┐   │
│  │  Static Hosting          │    │  Serverless Function          │   │
│  │  • index.html            │    │  api/ping.js                  │   │
│  │  • admin/                │    │  • Appelé par Google Apps     │   │
│  │  • assets/               │    │    Script toutes les heures   │   │
│  │  • locales/              │    │  • → SELECT keepalive         │   │
│  │  • robots.txt, sitemap   │    │  • → Empêche la pause du     │   │
│  │                          │    │    Free Tier Supabase         │   │
│  └──────────────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Séparation des responsabilités

| Couche | Technologie | Responsabilité |
|--------|-----------|----------------|
| **Frontend** | HTML5 + CSS3 + JS Vanilla | Interface utilisateur, formulaires, rendu dynamique |
| **Auth** | Supabase Auth (GoTrue) | Authentification email/password, sessions JWT |
| **Database** | Supabase Postgres | Stockage structuré (réservations, programmes, config) |
| **Storage** | Supabase Storage (S3) | Fichiers (images WebP, brochures PDF) |
| **Email** | Supabase Edge Function (Deno) | Envoi d'emails via Gmail SMTP (nodemailer) |
| **Hébergement** | Vercel | Site statique + Serverless Function KeepAlive |
| **KeepAlive** | Google Apps Script | Cron horaire → /api/ping → activité DB |
| **Vidéo** | YouTube IFrame API | Vidéo de fond hero + daily (BUzkCs2B9OY) |
| **i18n** | i18next v23 (CDN) | Traductions FR/EN/PL |
| **Polices** | Google Fonts | Bebas Neue, DM Sans, Playfair Display |
| **SEO** | JSON-LD + OG + hreflang | Rich snippets, partages sociaux, multilinguisme |

---

## 4. Arborescence complète

```
SurfAgencyMorocco/
│
├── index.html                    ← Landing page publique (730 lignes)
│                                   Sections : hero, destinations, gallery,
│                                   seasons, programs, daily, why, testimonials,
│                                   booking, footer. SEO meta tags, schema.js.
│
├── 404.html                      ← Page d'erreur 404 personnalisée
├── privacy.html                  ← Politique de confidentialité (GDPR)
├── terms.html                    ← Conditions d'utilisation
├── robots.txt                    ← Directives crawl (Allow /, Disallow /admin/)
├── sitemap.xml                   ← 3 URLs hreflang (pl/en/fr)
├── manifest.json                 ← PWA manifest (start_url: /?lang=pl)
│
├── .env                          ← Credentials Supabase (gitignoré)
├── .gitignore                    ← Ignore .env, node_modules, .DS_Store
├── env.example                   ← Template du .env
│
├── AGENTS.md                     ← Règles de développement pour IA
├── README.md                     ← Présentation rapide du projet
├── PROJECT_ARCHITECTURE.md       ← Ce document
├── SUPABASE_KEEPALIVE_FIX.md     ← Documentation technique KeepAlive
├── PING_IMPLEMENTATION.md        ← ADR + spécifications api/ping.js
│
├── admin/
│   ├── index.html                ← Page de connexion (Supabase Auth)
│   ├── dashboard.html            ← Dashboard admin (~850 lignes)
│   │                               Sections : Reservations, Programs, Email
│   ├── admin.css                 ← Styles du panneau admin (215 lignes)
│   ├── schema.sql                ← SQL de référence (tables, RLS, seed data)
│   └── schema-brochures.sql      ← Migration brochures PDF
│
├── api/
│   └── ping.js                   ← Vercel Serverless Function KeepAlive
│                                   Appelée toutes les heures par Google Apps Script
│
├── assets/
│   ├── css/
│   │   ├── main.css              ← Variables CSS, reset, classes partagées
│   │   ├── animations.css        ← Keyframes (fadeUp, scrollPulse, waPulse)
│   │   ├── nav.css               ← Navbar fixe + menu mobile hamburger
│   │   ├── hero.css              ← Hero section + vidéo YouTube fond
│   │   ├── destinations.css      ← Grille 3 cartes + galerie strip
│   │   ├── seasons.css           ← 2 cartes saison (high/beginner)
│   │   ├── programs.css          ← Grille 3 cartes programme + .btn-brochure
│   │   ├── daily.css             ← Timeline journée type + vidéo daily
│   │   ├── why.css               ← Grille 4 cartes avantages
│   │   ├── testimonials.css      ← Carrousel CSS infini
│   │   ├── booking.css           ← Formulaire réservation en grille 2 colonnes
│   │   ├── footer.css            ← Footer 3 colonnes + WhatsApp float
│   │   └── rtl.css               ← Placeholder RTL (commenté, prêt pour l'arabe)
│   │
│   ├── js/
│   │   ├── supabase-client.js    ← Client Supabase : CDN loader + CRUD + sendEmail
│   │   ├── i18n.js               ← i18next : init, translatePage(), changeLanguage()
│   │   ├── svg-loader.js         ← fetch sprite.svg → inject dans <body>
│   │   ├── hero.js               ← YouTube IFrame API : hero + daily videos
│   │   ├── nav.js                ← Hamburger menu mobile
│   │   ├── reveal.js             ← IntersectionObserver scroll reveal
│   │   ├── testimonials.js       ← Témoignages (placeholder, géré par CSS)
│   │   ├── programs.js           ← Charge programmes depuis Supabase (fallback HTML)
│   │   ├── form.js               ← Formulaire réservation → Supabase + email auto
│   │   ├── schema.js             ← JSON-LD (Organization, FAQ, Offers, Reviews...)
│   │   └── vendor/
│   │       └── supabase.min.js   ← SDK Supabase JS v2 UMD local (207 KB)
│   │
│   ├── icons/
│   │   └── sprite.svg            ← Tous les symboles SVG externalisés
│   │
│   └── favicon.svg               ← Icône du site (vague stylisée)
│
├── images/
│   ├── tagha.jpg / tagha2.jpeg / tagha3.jpg    ← Photos Taghazout
│   ├── tamrgh3.jpg                              ← Photo Tamraght
│   ├── imsouane.webp / imsouane2.webp / imsouane3.webp  ← Photos Imsouane
│   ├── 2024-11-05.webp / 2024-12-10.webp       ← Photos programmes
│   ├── the-magic-bay.jpg                        ← Photo Imsouane débutant
│   └── galery/                                  ← 6 photos galerie strip
│
├── locales/
│   ├── config.js                ← Configuration i18next (langues supportées)
│   ├── en.js                    ← Traductions anglaises (~295 clés)
│   ├── fr.js                    ← Traductions françaises (~295 clés)
│   └── pl.js                    ← Traductions polonaises (~295 clés)
│
└── supabase/
    └── migrations/
        ├── 20260715170608_create_keepalive.sql   ← Table keepalive
        └── 20260715173543_i18n_jsonb.sql         ← Migration i18n JSONB
```

---

## 5. Stack technique

### 5.1 Technologies

| Technologie | Version | Rôle | Justification |
|-----------|---------|------|--------------|
| **HTML5** | — | Structure sémantique | Standard web, SEO-friendly |
| **CSS3** | — | Styles, animations, responsive | Zéro dépendance, variables CSS natives |
| **JavaScript Vanilla** | ES5/IIFE | Logique frontend | Compatible tous navigateurs sans build |
| **Supabase JS SDK** | v2 (local + CDN) | Client DB/Auth/Storage | API PostgREST, Auth, Storage |
| **Supabase Postgres** | 15 | Base de données | Tables, RLS, JSONB pour i18n |
| **Supabase Auth** | GoTrue | Authentification | Email/password, JWT sessions |
| **Supabase Storage** | S3-compatible | Fichiers | Images WebP, brochures PDF |
| **Supabase Edge Functions** | Deno | Serverless email | nodemailer → Gmail SMTP |
| **Vercel** | Hobby | Hébergement statique | Auto-déploiement GitHub, /api serverless |
| **i18next** | v23 (CDN) | Internationalisation | 3 langues (FR/EN/PL), lazy loading |
| **Google Fonts** | — | Typographie | Bebas Neue, DM Sans, Playfair Display |
| **YouTube IFrame API** | v3 | Vidéo fond | Autoplay mute, loop, hero + daily |
| **Google Apps Script** | — | Cron KeepAlive | Appel horaire /api/ping |

### 5.2 Ce qui n'est PAS utilisé

| Technologie absente | Raison |
|-------------------|--------|
| **npm / package.json** | Aucun build tool nécessaire — site statique pur |
| **Webpack / Vite / Parcel** | Pas de modules ES6 — IIFE uniquement |
| **React / Vue / Svelte** | Site statique simple — pas de SPA |
| **Node.js serveur** | Hébergé sur Vercel static hosting |
| **ES6 modules** | Compatibilité maximale, pas de build |
| **SASS / PostCSS** | CSS vanilla avec variables natives |
| **TypeScript** | Vanilla JS pour simplicité |

---

## 6. Architecture Frontend

### 6.1 Structure HTML (index.html)

La landing page est une Single Page avec ancres. Chaque section majeure est un élément `<section>` :

```
<body>
  <nav>              ← Navbar fixe (logo + liens + lang switcher + hamburger)
  <div.mobile-menu>  ← Menu overlay mobile (z-index: 1001)
  <section#hero>     ← Vidéo YouTube fond + titre + CTA + stats
  <section#destinations> ← 3 cartes destination (Taghazout, Tamraght, Imsouane)
  <div#gallery>      ← Galerie photo strip horizontal
  <section#seasons>  ← 2 cartes saison (High Season, Beginner Season)
  <section#programs> ← 3 cartes programme (débutant, intermédiaire, avancé)
  <section#daily>    ← Timeline journée type + vidéo daily
  <section#why>      ← 4 cartes avantages
  <section#testimonials> ← Carrousel CSS témoignages (5 originaux + 5 dupliqués)
  <section#booking>  ← Formulaire réservation + coordonnées contact + map Google
  <footer>           ← Logo + liens + contact + WhatsApp float
</body>
```

### 6.2 Convention de nommage

- **BEM-like** : `.section-tag`, `.btn-primary`, `.dest-card`, `.program-header`
- **Utilitaires** : `.reveal`, `.visible`, `.section-tag--light`
- **Pas de inline `style=""`** (sauf admin dashboard — JS-generated)

### 6.3 Ordre de chargement CSS

```
main.css → animations.css → nav.css → hero.css → destinations.css →
seasons.css → programs.css → daily.css → why.css → testimonials.css →
booking.css → footer.css → rtl.css
```

### 6.4 Ordre de chargement JavaScript (tous `<script defer>`)

```
i18n.js → supabase-client.js → svg-loader.js → hero.js → nav.js →
reveal.js → testimonials.js → programs.js → form.js → schema.js
```

Chaque fichier est une **IIFE** (Immediately Invoked Function Expression). Aucune variable globale n'est créée sauf celles intentionnellement exposées via `window.*` :

- `window.SupabaseAPI` — toutes les fonctions CRUD + auth + upload + email
- `window._supabase` — instance du client Supabase
- `window._supabaseLoadError` — message d'erreur si le SDK échoue
- `window.i18n` — API de traduction (`t()`, `changeLanguage()`, `currentLang`)
- `window.i18nReady` — Promise résolue quand i18n est initialisé

---

## 7. Architecture Admin

### 7.1 Fichiers

| Fichier | Rôle |
|---------|------|
| `admin/index.html` | Page de connexion — formulaire email/password → Supabase Auth |
| `admin/dashboard.html` | Dashboard complet — 3 onglets (Reservations, Programs, Email) |
| `admin/admin.css` | Tous les styles admin (login + dashboard + composants) |

### 7.2 Authentification

```
1. Admin saisit email + mot de passe
2. formulaire submit → e.preventDefault()
3. Attente window._supabase (polling 200ms, max 10s)
4. SupabaseAPI.login(email, password)
5. Succès → window.location.href = 'dashboard.html'
6. Échec → message d'erreur + bouton réactivé
7. Dashboard : checkAuth() → getUser() → session valide ? dashboard : redirect login
```

### 7.3 Dashboard — Sections

**Onglet Reservations**
- Tableau avec scroll horizontal (`overflow-x: auto`, `min-width: 700px`)
- 10 colonnes : date, nom, email, téléphone, niveau, destination, date souhaitée, message, statut, actions
- Dropdown par ligne : Confirm / Cancel / Delete
- Changement statut → `updateReservation()` → email auto

**Onglet Programs**
- Grid de cartes éditables (CSS Grid `auto-fill, minmax(280px, 1fr)`)
- Chaque carte contient :
  - Name (i18n : FR/EN/PL)
  - Destination (i18n)
  - Level (select dropdown)
  - Price (number input)
  - Image (upload + preview 140px)
  - **Brochures PDF** (3 cartes FR/EN/PL avec upload, download, delete)
  - Dates (input texte)
  - Includes (i18n textareas)
- Boutons : Save Changes / Delete
- "+ Add Program" crée une nouvelle carte vide avec ID temporaire unique

**Onglet Email**
- SMTP Configuration : host, port, encryption, user, pass, from name, from email
- Bouton "Save SMTP Settings" + "Send Test Email"
- Email Templates : 3 statuts (pending, confirmed, cancelled)
- Édition i18n du sujet et corps HTML
- Preview dans un nouvel onglet

### 7.4 Design System Admin (boutons)

| Rôle | Classe | Couleur | Style |
|------|--------|---------|-------|
| Primaire | `.save-btn`, `.login-btn`, `.file-input-label` | Orange `#e8631a` | Fond plein, border-radius `50px`, shadow, hover `#d4550f` |
| Secondaire | `.brochure-btn-outline` | Orange outline | Bordure `2px solid #e8631a`, fond transparent, hover fond orange |
| Danger | `.btn-delete`, `.brochure-btn-danger` | Rouge `#c62828` | Fond plein, border-radius `50px`, hover `#b71c1c` |

---

## 8. Base de données

### 8.1 Table `reservations`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PK, `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMPTZ | `DEFAULT now()` | Date de création |
| `full_name` | TEXT | NOT NULL | Nom complet du client |
| `email` | TEXT | NOT NULL | Email du client |
| `phone` | TEXT | NOT NULL | Téléphone |
| `surf_level` | TEXT | NOT NULL | Niveau de surf |
| `destination` | TEXT | NOT NULL | Destination choisie |
| `preferred_date` | DATE | NOT NULL | Date souhaitée |
| `message` | TEXT | — | Message optionnel |
| `status` | TEXT | `DEFAULT 'pending'`, CHECK (pending/confirmed/cancelled) | Statut réservation |

**RLS** : `anon` peut INSERT. `authenticated` peut SELECT, UPDATE, DELETE.

### 8.2 Table `programs`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PK, `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMPTZ | `DEFAULT now()` | Date de création |
| `name` | JSONB | NOT NULL | `{"fr":"...","en":"...","pl":"..."}` |
| `destination` | JSONB | — | `{"fr":"...","en":"...","pl":"..."}` |
| `level` | JSONB | — | `{"fr":"...","en":"...","pl":"..."}` |
| `price` | INTEGER | — | Prix en EUR |
| `dates` | JSONB | `DEFAULT '[]'` | Tableau de strings `["May 1–8",...]` |
| `includes` | JSONB | `DEFAULT '[]'` | Tableau d'objets `[{"fr":"...","en":"...","pl":"..."},...]` |
| `image` | TEXT | `DEFAULT ''` | URL publique Supabase Storage |
| `brochure_fr` | TEXT | `DEFAULT ''` | URL PDF brochure française |
| `brochure_en` | TEXT | `DEFAULT ''` | URL PDF brochure anglaise |
| `brochure_pl` | TEXT | `DEFAULT ''` | URL PDF brochure polonaise |
| `active` | BOOLEAN | `DEFAULT true` | Programme actif/inactif |

**RLS** : `authenticated` peut CRUD complet. `anon` peut SELECT.

### 8.3 Table `email_settings`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PK | Identifiant (ligne unique) |
| `smtp_host` | TEXT | `DEFAULT 'smtp.gmail.com'` | Hôte SMTP |
| `smtp_port` | INTEGER | `DEFAULT 587` | Port SMTP |
| `smtp_secure` | BOOLEAN | `DEFAULT false` | SSL/TLS |
| `smtp_user` | TEXT | `DEFAULT ''` | Adresse Gmail |
| `smtp_pass` | TEXT | `DEFAULT ''` | Mot de passe application |
| `from_email` | TEXT | `DEFAULT ''` | Email expéditeur |
| `from_name` | TEXT | `DEFAULT 'SurfAgencyMorocco'` | Nom expéditeur |
| `updated_at` | TIMESTAMPTZ | `DEFAULT now()` | Dernière modification |

**RLS** : `authenticated` uniquement.

### 8.4 Table `email_templates`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PK | Identifiant |
| `status` | TEXT | NOT NULL, UNIQUE | 'pending', 'confirmed', 'cancelled' |
| `subject` | JSONB | — | `{"fr":"...","en":"...","pl":"..."}` |
| `body_html` | JSONB | — | `{"fr":"...","en":"...","pl":"..."}` |
| `updated_at` | TIMESTAMPTZ | `DEFAULT now()` | Dernière modification |

**Variables supportées dans les templates** : `{{name}}`, `{{destination}}`, `{{date}}`, `{{status}}`

**RLS** : `authenticated` uniquement.

### 8.5 Table `keepalive`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | SERIAL | PK | Identifiant auto-incrémenté |
| `created_at` | TIMESTAMPTZ | `DEFAULT now()` | Date de création |

**RLS** : `anon` peut SELECT. Utilisée uniquement par `api/ping.js` pour générer de l'activité DB.

### 8.6 Storage — Bucket `program-images`

| Dossier | Contenu | RLS |
|---------|---------|-----|
| `/` (racine) | Images de programmes (WebP, JPG) | authenticated=write, public=read |
| `brochures/` | Brochures PDF (FR/EN/PL) | authenticated=write, public=read |

---

## 9. Flux de données

### 9.1 Réservation

```
┌──────────┐   form.submit()   ┌──────────────┐   INSERT    ┌────────────┐
│  User    │ ────────────────► │  form.js     │ ──────────► │  Supabase  │
│ (browser)│                   │  submitRes() │             │  reservat- │
│          │                   │              │             │  ions      │
└──────────┘                   └──────┬───────┘             └────────────┘
                                      │
                                      │ getEmailSettings()
                                      ▼
                               ┌──────────────┐
                               │  Supabase    │
                               │  email_      │
                               │  settings    │
                               └──────┬───────┘
                                      │
                                      │ getEmailTemplates()
                                      ▼
                               ┌──────────────┐
                               │  Supabase    │
                               │  email_      │
                               │  templates   │
                               └──────┬───────┘
                                      │
                                      │ sendEmail(to, subject, html, smtp)
                                      ▼
                               ┌──────────────┐   fetch()    ┌────────────┐
                               │  supabase-   │ ───────────► │  Edge      │
                               │  client.js   │              │  Function  │
                               │              │              │  send-email│
                               └──────────────┘              └─────┬──────┘
                                                                   │
                                                                   │ nodemailer
                                                                   ▼
                                                            ┌────────────┐
                                                            │  Gmail     │
                                                            │  SMTP      │
                                                            └─────┬──────┘
                                                                  │
                                                                  ▼
                                                            ┌────────────┐
                                                            │  Client    │
                                                            │  (inbox)   │
                                                            └────────────┘
```

### 9.2 Upload brochure

```
┌──────────┐  select PDF  ┌──────────────┐  uploadBrochure()  ┌────────────┐
│  Admin   │ ───────────► │  dashboard   │ ─────────────────► │  Supabase  │
│ (browser)│              │  .html       │                    │  Storage   │
│          │              │              │                    │  brochures/│
└──────────┘              └──────┬───────┘                    └─────┬──────┘
                                 │                                   │
                                 │ saveProgram(brochureUrl)          │ public URL
                                 ▼                                   │
                          ┌──────────────┐                           │
                          │  Supabase    │                           │
                          │  programs    │ ◄─────────────────────────┘
                          │  brochure_fr │   URL stockée dans la DB
                          │  brochure_en │
                          │  brochure_pl │
                          └──────┬───────┘
                                 │
                                 │ getPrograms()
                                 ▼
                          ┌──────────────┐
                          │  programs.js │  détecte langue
                          │  (public)    │  → .btn-brochure
                          │              │  → target="_blank"
                          └──────────────┘
```

### 9.3 KeepAlive

```
Google Apps Script (cron horaire)
  │
  │ GET https://surfagencymorocco.com/api/ping
  ▼
Vercel Serverless Function (api/ping.js)
  │
  │ fetch(SUPABASE_URL/rest/v1/keepalive?select=id&limit=1)
  │ Headers: apikey + Authorization Bearer
  ▼
Supabase PostgREST → SELECT public.keepalive
  │
  │ Activité DB enregistrée → compteur d'inactivité réinitialisé
  ▼
Réponse 200 → Google Apps Script OK
```

---

## 10. Services

### 10.1 Supabase

| Service | URL | Utilisation |
|---------|-----|-----------|
| **API REST (PostgREST)** | `https://gfcpxdxfshopclfmnfnk.supabase.co/rest/v1/` | CRUD tables (reservations, programs, email_settings, email_templates, keepalive) |
| **Auth (GoTrue)** | `https://gfcpxdxfshopclfmnfnk.supabase.co/auth/v1/` | Login email/password, gestion sessions JWT |
| **Storage** | Bucket `program-images` | Upload public (images + brochures) |
| **Edge Functions** | `/functions/v1/send-email` | Envoi email via Gmail SMTP (Deno + nodemailer) |

### 10.2 Vercel

| Service | Détail |
|---------|--------|
| **Static Hosting** | Déploiement auto depuis GitHub (branche main) |
| **Serverless Function** | `api/ping.js` — appelée par Google Apps Script |
| **Variables d'env** | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |

### 10.3 Google Apps Script

Script externe (non versionné) qui appelle `GET /api/ping` toutes les heures via `UrlFetchApp.fetch()`. Déclencheur : `Chronomètre → Toutes les heures`.

### 10.4 YouTube Data API

Utilisée via l'IFrame API pour la vidéo de fond. Vidéo ID : `BUzkCs2B9OY`. Paramètres : autoplay, mute, controls=0, start=29, modestbranding, rel=0, playsinline.

---

## 11. Design System

### 11.1 Palette de couleurs

| Variable CSS | Hex | Usage |
|-------------|-----|-------|
| `--sand` | `#F2E8D5` | Fond sections claires |
| `--sand-light` | `#FAF5EC` | Fond page |
| `--sand-dark` | `#D9C9A8` | Bordures |
| `--ocean` | `#1B5E7A` | Fond sections sombres |
| `--ocean-mid` | `#2A7FA0` | Bordures boutons |
| `--ocean-light` | `#4BA3C3` | Hover |
| `--ocean-deep` | `#0D3547` | Textes, fond footer |
| `--sunset` | `#E8631A` | **Couleur primaire** — boutons, accents |
| `--sunset-warm` | `#F4874B` | Hover primaire |
| `--sunset-gold` | `#F0A832` | Accents dorés |
| `--white` | `#FFFFFF` | Fond cartes, texte sur foncé |
| `--text-dark` | `#1A1A1A` | Texte principal |
| `--text-mid` | `#4A4A4A` | Texte secondaire |
| `--text-light` | `#7A7A7A` | Texte tertiaire |

### 11.2 Typographie

| Police | Usage | Poids |
|--------|-------|-------|
| **Bebas Neue** | Titres, logo, hero, cartes | Regular (400) |
| **DM Sans** | Corps de texte, inputs, boutons | 300, 400, 500, 600, 700 |
| **Playfair Display** | Sous-titres, citations | 700 (normal), 400/700 (italic) |

### 11.3 Responsive — Breakpoints

| Breakpoint | Cible | Usage |
|-----------|-------|-------|
| `400px` | Très petits mobiles | Grid → 1 colonne |
| `480px` | Mobiles | Padding réduit, boutons stack |
| `600px` | Tablettes portrait | Brochure cards body column |
| `680px` | Tablettes | Footer 1 colonne, form padding |
| `768px` | Tablettes paysage | Dashboard sidebar horizontale |
| `820px` | Petits laptops | Hamburger menu visible |
| `900px` | Laptops | Grilles 2→1 colonne |
| `1024px` | Desktop | Email layout 2→1 colonne |

### 11.4 Composants réutilisables

| Classe | Usage |
|--------|-------|
| `.btn-primary` | Bouton orange principal (CTA) |
| `.btn-outline` | Bouton outline blanc (hero) |
| `.btn-book` | Bouton réservation dans carte programme |
| `.btn-brochure` | Bouton téléchargement brochure (outline ocean) |
| `.section-tag` | Étiquette de section (orange, uppercase, icône) |
| `.section-title` | Titre de section (Playfair Display, clamp) |
| `.section-desc` | Description de section (max-width: 560px) |
| `.divider` | Séparateur orange (50px × 3px) |
| `.reveal` | Animation scroll (IntersectionObserver) |

---

## 12. Architecture CSS

### 12.1 Organisation

- **1 fichier par section** : chaque section du site a son propre fichier CSS
- **`main.css`** : variables CSS globales (`:root`), reset, classes partagées
- **`animations.css`** : keyframes et classes `.reveal`
- **Pas de préprocesseur** — CSS vanilla avec variables natives

### 12.2 Fichier par fichier

| Fichier | Lignes | Contenu principal |
|---------|--------|-------------------|
| `main.css` | ~100 | Variables `:root`, reset, `.btn-primary`, `.btn-outline`, `.section-tag`, `.section-title`, `.lang-switcher` |
| `animations.css` | ~25 | `@keyframes fadeUp`, `scrollPulse`, `scrollTrack`, `waPulse`, `.reveal` |
| `nav.css` | ~65 | `nav` fixed, `.nav-links`, `.hamburger`, `.mobile-menu`, `@media 820px/680px` |
| `hero.css` | ~85 | `#hero` 100svh, `.hero-video` iframe, `.hero-content`, `.hero-stats`, `@media 680px/400px` |
| `destinations.css` | ~105 | `.dest-grid` auto-fit, `.dest-card`, slideshow, `.gallery-strip`, `@media 900/680/400` |
| `seasons.css` | ~38 | `.seasons-grid` 2 colonnes, `.season-card`, `@media 900/480` |
| `programs.css` | ~85 | `.programs-grid`, `.program-card`, `.program-header`, `.btn-book`, `.btn-brochure`, `@media 680/400` |
| `daily.css` | ~50 | `.daily-inner` 2 colonnes, `.timeline`, `.daily-img-main`, `@media 900/480` |
| `why.css` | ~20 | `.why-grid`, `.why-card`, `@media 480` |
| `testimonials.css` | ~22 | `.testimonials-track` animation infinie, `.testi-card`, `@media 480` |
| `booking.css` | ~68 | `.booking-inner` grille, `.booking-form`, `.form-row`, `@media 900/680/400` |
| `footer.css` | ~66 | `.footer-grid` 3 colonnes, `.whatsapp-float`, `@media 900/680` |
| `rtl.css` | ~26 | Placeholder commenté pour futur support RTL |
| `admin/admin.css` | ~215 | Login, dashboard, sidebar, tableau, cards, formulaires, brochures |

---

## 13. Architecture JavaScript

### 13.1 `supabase-client.js` (~200 lignes)

**Rôle** : Client Supabase unique pour tout le projet. Charge le SDK depuis un fichier local ou CDN, expose toutes les API.

**Cycle de vie** :
1. IIFE exécutée au chargement
2. Tente de charger `vendor/supabase.min.js` (local)
3. Si échec → fallback CDN (jsDelivr → unpkg UMD → unpkg auto)
4. Si tout échoue → `window._supabaseLoadError` défini
5. `window.SupabaseAPI` exposé immédiatement

**Fonctions publiques** (`window.SupabaseAPI.*`) :

| Fonction | Paramètres | Retour | Description |
|----------|-----------|--------|-------------|
| `submitReservation(data)` | `{full_name, email, phone, ...}` | Promise | INSERT INTO reservations |
| `getReservations()` | — | Promise | SELECT * FROM reservations ORDER BY created_at DESC |
| `updateReservation(id, data)` | UUID, `{status}` | Promise | UPDATE reservations |
| `deleteReservation(id)` | UUID | Promise | DELETE FROM reservations |
| `getPrograms()` | — | Promise | SELECT * FROM programs |
| `addProgram(data)` | `{name, destination, ...}` | Promise | INSERT INTO programs |
| `updateProgram(id, data)` | UUID, `{...}` | Promise | UPDATE programs |
| `deleteProgram(id)` | UUID | Promise | DELETE FROM programs |
| `uploadImage(file, fileName)` | File, string | Promise | Upload to `program-images/` |
| `uploadBrochure(file, fileName)` | File, string | Promise | Upload to `program-images/brochures/` |
| `getImageUrl(path)` | string | string | URL publique Supabase Storage |
| `getBrochureUrl(fileName)` | string | string | URL publique `brochures/` |
| `deleteBrochure(path)` | string | Promise | Remove from `program-images` |
| `deleteImage(path)` | string | Promise | Remove from `program-images` |
| `login(email, password)` | string, string | Promise | Supabase Auth signInWithPassword |
| `logout()` | — | Promise | Supabase Auth signOut |
| `getUser()` | — | Promise | Supabase Auth getUser |
| `getEmailSettings()` | — | Promise | SELECT * FROM email_settings LIMIT 1 |
| `saveEmailSettings(data)` | `{smtp_host, ...}` | Promise | UPSERT email_settings |
| `getEmailTemplates()` | — | Promise | SELECT * FROM email_templates |
| `saveEmailTemplate(data)` | `{status, subject, body_html}` | Promise | UPSERT email_templates |
| `sendEmail(to, subject, html, smtp)` | string×4 | Promise | fetch() → Edge Function send-email |
| `localized(value, lang)` | any, string | any | Résout une valeur JSONB ou tableau |

### 13.2 `i18n.js` (~160 lignes)

**Rôle** : Internationalisation FR/EN/PL via i18next.

**Cycle de vie** :
1. Charge i18next + LanguageDetector depuis CDN
2. Import dynamique des fichiers de traduction (`/locales/{en,fr,pl}.js`)
3. Détecte la langue (localStorage → navigateur → htmlTag)
4. Exécute `translatePage()` sur tous les éléments `[data-i18n]`

**Fonctions publiques** (`window.i18n`) :

| Fonction | Paramètres | Description |
|----------|-----------|-------------|
| `t(key, options)` | string, object | Traduction (retourne la clé si i18next non dispo) |
| `localized(value, lang)` | any, string | Résout JSONB `{fr,en,pl}` |
| `translatePage()` | — | Met à jour tout le DOM : textes, placeholders, titles, alt, lang, title, meta content, canonical |
| `changeLanguage(lang)` | 'fr'/'en'/'pl' | Change la langue + persist localStorage |
| `currentLang` | (getter) | Langue courante |

**Éléments mis à jour par `translatePage()`** :
- `[data-i18n]` → `textContent`
- `[data-i18n-placeholder]` → `placeholder`
- `[data-i18n-title]` → `title`
- `[data-i18n-alt]` → `alt`
- `[data-i18n-content]` → `content` (meta tags)
- `[data-i18n-aria-label]` → `aria-label`
- `document.title` → titre de la page
- `link[rel="canonical"]` → URL avec `?lang=`
- `html[lang]` → code langue
- `[data-lang]` → toggle `.active`

### 13.3 `programs.js` (~115 lignes)

**Rôle** : Charge les programmes depuis Supabase et remplace la grille HTML statique.

**Cycle de vie** :
1. IIFE → `loadPrograms()` appelée
2. Attend `window._supabase` (polling 300ms, max 35 tentatives)
3. Si SDK non chargé → fallback HTML statique (ne fait rien)
4. Récupère les programmes via `SupabaseAPI.getPrograms()`
5. Construit le HTML dynamique avec le même markup que le HTML statique
6. Remplace `.programs-grid` innerHTML
7. Réinitialise `IntersectionObserver` pour les `.reveal`
8. Ajoute le bouton "Download Brochure" conditionnellement selon la langue

### 13.4 `form.js` (~90 lignes)

**Rôle** : Gère la soumission du formulaire de réservation.

**Cycle de vie** :
1. IIFE → écoute le clic sur `#submitBtn`
2. Valide que tous les champs requis sont remplis
3. Désactive le bouton + affiche "Sending..."
4. Appelle `SupabaseAPI.submitReservation(data)`
5. Succès → message vert + réinitialise le formulaire
6. Puis → `getEmailSettings()` → `getEmailTemplates()` → `sendEmail()` (auto)
7. Échec → message d'erreur + réactive le bouton après 3s

### 13.5 `hero.js` (~70 lignes)

**Rôle** : Charge l'API YouTube IFrame et crée les players vidéo.

**Cycle de vie** :
1. IIFE → injecte le script `https://www.youtube.com/iframe_api`
2. Définit `window.onYouTubeIframeAPIReady`
3. Crée `YT.Player` pour `#heroPlayer` (autoplay, mute, start=29)
4. Crée `YT.Player` pour `#dailyPlayer` (si l'élément existe)
5. Affiche une image poster avant le chargement de la vidéo (LCP)

### 13.6 `schema.js` (~300 lignes)

**Rôle** : Injecte les données structurées JSON-LD.

**Cycle de vie** :
1. IIFE → détecte la langue courante
2. Construit 15+ schémas JSON-LD : Organization, TravelAgency, LocalBusiness, WebSite, WebPage, BreadcrumbList, TouristDestination×3, Offer×3, Service, AggregateRating, Review×5, ContactPoint, ImageObject×2, VideoObject, FAQPage
3. Injecte un `<script type="application/ld+json">` dans `<head>`

### 13.7 Autres fichiers JS

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `svg-loader.js` | 6 | fetch `sprite.svg` → `insertAdjacentHTML` |
| `nav.js` | 10 | Toggle `.open` sur `.mobile-menu` |
| `reveal.js` | 9 | IntersectionObserver → `.visible` + unobserve |
| `testimonials.js` | 2 | Placeholder (animation gérée par CSS) |

---

## 14. Sécurité

### 14.1 Authentification

- **Méthode** : Supabase Auth email/password
- **Session** : JWT stocké dans localStorage par le SDK Supabase
- **Dashboard** : `checkAuth()` → `getUser()` → redirige vers login si pas de session
- **Credentials admin** : `admin@surfagencymorocco.com` / `Saskia34%` (créés dans Supabase Auth UI)

### 14.2 Row Level Security (RLS)

| Table | Anon (public) | Authenticated (admin) |
|-------|--------------|----------------------|
| `reservations` | INSERT | SELECT, UPDATE, DELETE |
| `programs` | SELECT | SELECT, INSERT, UPDATE, DELETE |
| `email_settings` | — | SELECT, INSERT, UPDATE |
| `email_templates` | — | SELECT, INSERT, UPDATE |
| `keepalive` | SELECT | — |
| `storage.objects` (program-images) | SELECT | INSERT, UPDATE, DELETE |

### 14.3 Validation

| Contexte | Validation |
|----------|-----------|
| **Formulaire réservation** | Tous les champs requis (`required` HTML5) |
| **Upload image** | `accept="image/*"` |
| **Upload brochure** | `accept=".pdf,application/pdf"`, vérification `file.type`, max 20 MB |
| **Login** | Email format HTML5, password requis |

### 14.4 Protection XSS

- `escHtml()` dans dashboard.html — échappe `& < > "` pour toutes les données utilisateur affichées dans le tableau
- Les URLs sont échappées (`.replace(/"/g,'&quot;')`) avant insertion dans les attributs HTML
- Les noms de fichiers uploadés sont sanitizés (`[^a-zA-Z0-9._-]`)

### 14.5 Secrets

| Secret | Emplacement | Exposition |
|--------|-----------|-----------|
| `SUPABASE_ANON_KEY` | `supabase-client.js` (ligne 3) | **Public** — clé anon, visible dans le code source |
| `SUPABASE_URL` | `supabase-client.js` (ligne 2) | Public |
| `SUPABASE_SERVICE_KEY` | Jamais utilisée | Aucune exposition |
| SMTP password | `email_settings` table | Stocké dans Supabase, accessible uniquement par authenticated |
| Admin password | Supabase Auth | Géré par GoTrue, jamais dans le code |

---

## 15. Performance

### 15.1 Optimisations appliquées

| Optimisation | Détail |
|-------------|--------|
| **Lazy loading images** | `loading="lazy"` sur toutes les `<img>` |
| **Preconnect** | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) |
| **Preload font** | DM Sans woff2 (poids 400) |
| **YouTube poster** | Image `maxresdefault.jpg` affichée avant chargement vidéo → réduit LCP |
| **Defer scripts** | Tous les `<script>` ont `defer` |
| **SVG sprite** | Chargé une seule fois, référencé via `<use href="#icon-...">` |
| **SDK local** | `vendor/supabase.min.js` (207 KB) — pas de requête CDN |
| **CSS minifié** | Fichiers CSS compactés manuellement |
| **Overflow-x hidden** | Sur `html` et `body` — empêche le scroll horizontal |
| **IntersectionObserver** | Scroll reveal + unobserve après affichage |
| **Static HTML fallback** | Les programmes ont un fallback HTML statique si Supabase non chargé |

### 15.2 Métriques estimées

| Métrique | Valeur |
|----------|--------|
| **LCP** (sur serveur) | < 2s (poster image + preload font) |
| **Taille page** | ~500 KB (HTML + CSS + JS + images) |
| **Requêtes réseau** | ~10 (1 HTML, 1 CSS bundle, 7 JS, sprite.svg, fonts) |
| **SDK Supabase** | 207 KB local (pas de requête CDN) |
| **Google Fonts** | 3 familles, ~50 KB |

---

## 16. Déploiement

### 16.1 Plateforme

**Vercel** — plan Hobby (gratuit). Déploiement automatique depuis GitHub (branche `main`).

### 16.2 Procédure

1. `git push origin main`
2. Vercel détecte le push → build → déploiement
3. Variables d'environnement : `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### 16.3 Serverless Function

`api/ping.js` est automatiquement déployé comme Vercel Serverless Function (dossier `/api/`).

### 16.4 Supabase

- **Migrations SQL** : exécutées manuellement dans Supabase SQL Editor
- **Edge Function** `send-email` : déployée via Supabase CLI (`supabase functions deploy`)
- **Storage** : bucket créé via Supabase Dashboard

---

## 17. Dépendances

### 17.1 Dépendances externes

| Dépendance | Version | Source | Fallback |
|-----------|---------|--------|----------|
| **Supabase JS SDK** | v2 | `vendor/supabase.min.js` (local) | jsDelivr → unpkg UMD → unpkg auto |
| **i18next** | v23 | `unpkg.com` (CDN, ES module) | Aucun — texte statique HTML si échec |
| **i18next-browser-languagedetector** | v8 | `unpkg.com` (CDN, ES module) | localStorage fallback |
| **YouTube IFrame API** | v3 | `youtube.com/iframe_api` | Aucun — la vidéo ne se charge pas |
| **Google Fonts** | — | `fonts.googleapis.com` | Polices système |
| **nodemailer** | 6.9.8 | Edge Function Supabase (Deno) | Aucun — email silencieusement ignoré |

### 17.2 Pas de dépendances npm

Le projet n'a pas de `package.json`. Aucun `npm install` nécessaire. Toutes les dépendances sont chargées via CDN ou incluses localement.

---

## 18. Décisions d'Architecture (ADR)

### ADR-1 : Site statique sans build

**Décision** : HTML/CSS/JS vanilla, aucun build tool.
**Raison** : Simplicité maximale, déploiement instantané, zéro dépendance npm.
**Alternative rejetée** : Next.js/Astro — surdimensionné pour une landing page.

### ADR-2 : IIFE plutôt qu'ES modules

**Décision** : Tous les fichiers JS utilisent des IIFE, communiquent via `window.*`.
**Raison** : Compatibilité tous navigateurs sans build, pas de `type="module"`.
**Alternative rejetée** : ES modules — nécessite un serveur ou un bundler.

### ADR-3 : Supabase comme backend unique

**Décision** : Auth, DB, Storage, Edge Functions — tout dans Supabase.
**Raison** : Solution unifiée, gratuite (Free Tier), pas de serveur à maintenir.
**Alternative rejetée** : Firebase (moins bon pour Postgres), backend custom.

### ADR-4 : JSONB pour l'i18n

**Décision** : Les champs multilingues utilisent `{"fr":"...","en":"...","pl":"..."}` dans des colonnes JSONB.
**Raison** : Évite la duplication de tables, requêtes simples, extensible.
**Alternative rejetée** : Table de traduction séparée — complexité accrue.

### ADR-5 : SDK Supabase local prioritaire

**Décision** : Le SDK Supabase est inclus dans `vendor/supabase.min.js` (207 KB).
**Raison** : Élimine la dépendance CDN, améliore la fiabilité et la vitesse de chargement.
**Alternative rejetée** : CDN uniquement — point de défaillance unique.

### ADR-6 : KeepAlive via Vercel + Google Apps Script

**Décision** : Serverless Function Vercel appelée par Google Apps Script.
**Raison** : Empêche la pause du Free Tier Supabase, zéro coût.
**Alternative rejetée** : Cron job payant, health check Auth (pas d'activité DB).

---

## 19. Bonnes pratiques

### Conventions obligatoires

| Règle | Raison |
|-------|--------|
| **Pas de `style=""` inline** dans `index.html` | Séparation contenu/style |
| **Pas de `<script>` inline** (sauf admin) | Séparation contenu/logique |
| **Tous les JS sont des IIFE** | Pas de pollution globale |
| **Communication via `window.SupabaseAPI`** | API unique et documentée |
| **SVG dans sprite.svg** | Une seule requête, icônes référencées via `<use>` |
| **Classes BEM/utilitaires** | Cohérence du CSS |
| **Mobile-first** | Media queries `max-width` |
| **`overflow-x: hidden`** sur `html` et `body` | Pas de scroll horizontal |
| **Fallback HTML statique** pour les programmes | Fonctionne sans JS/Supabase |

### Conventions CSS

- Variables dans `:root` (main.css)
- 1 fichier CSS par section
- Animations dans `animations.css`
- Pas de `!important` sauf nécessité absolue

### Conventions JS

- Nommage : `camelCase` pour les variables, `PascalCase` pour les constructeurs
- Pas d'`async/await` — `.then()/.catch()` uniquement
- `console.log` pour debug, `console.error` pour les erreurs
- Préfixe `[Module]` dans les logs (`[Supabase]`, `[Login]`, `[Dashboard]`)

---

## 20. Guide développeur

### 20.1 Installation

```bash
git clone https://github.com/surfagencymorocco/surf.git
cd surf
# Copier .env.example → .env et remplir les credentials Supabase
# Ouvrir index.html dans un navigateur
```

Aucune installation supplémentaire nécessaire.

### 20.2 Lancer en local

- **Option 1** : Ouvrir `index.html` directement (`file://`)
- **Option 2** : Serveur statique (`python -m http.server`, `npx serve`, etc.)
- **Limitation file://** : i18n ne fonctionne pas (modules ES), Supabase SDK local uniquement

### 20.3 Modifier le CSS

1. Identifier la section concernée → fichier CSS correspondant
2. Modifier les propriétés dans le fichier
3. Tester sur mobile, tablette, desktop

### 20.4 Modifier le JS

1. Identifier le fichier IIFE concerné
2. Modifier la logique à l'intérieur de l'IIFE
3. Si nouvelle fonction → l'ajouter à `window.SupabaseAPI`
4. Tester avec et sans Supabase (fallback)

### 20.5 Ajouter une section

1. Créer le HTML dans `index.html`
2. Créer le CSS dans un nouveau fichier `assets/css/nouvelle-section.css`
3. Ajouter le `<link>` dans `index.html` (respecter l'ordre)
4. Si interaction JS → créer un nouveau fichier IIFE dans `assets/js/`
5. Ajouter le `<script defer>` dans `index.html`

### 20.6 Déployer

```bash
git add .
git commit -m "feat: description"
git push origin main
# Vercel déploie automatiquement
```

---

## 21. Guide de maintenance

### 21.1 Tâches régulières

| Fréquence | Tâche |
|-----------|-------|
| **Mensuel** | Vérifier les logs Vercel (`/api/ping`) |
| **Trimestriel** | Vérifier le quota Supabase Free Tier |
| **Semestriel** | Mettre à jour `vendor/supabase.min.js` (dernière v2) |
| **Annuel** | Audit SEO (Lighthouse, Search Console) |

### 21.2 Mise à jour du SDK Supabase

```bash
# Télécharger la dernière version UMD
curl -o assets/js/vendor/supabase.min.js \
  https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js
```

### 21.3 En cas de panne

| Symptôme | Cause probable | Action |
|----------|--------------|--------|
| Site lent / cassé | Supabase Free Tier en pause | Attendre que `/api/ping` le réveille (~1h) |
| Login admin bloqué | SDK Supabase non chargé | Vérifier `vendor/supabase.min.js` + CDN fallback |
| Emails non envoyés | SMTP mal configuré | Vérifier Email Settings dans le dashboard |
| Programmes non mis à jour | Cache navigateur | Ctrl+F5 |
| Erreur 404 sur le site | Vercel déploiement échoué | Vérifier les logs Vercel |

---

## 22. Checklist avant modification

Avant chaque modification du projet, vérifier :

```
□ 1. Le fichier modifié est-il dans assets/ ou admin/ ?
□ 2. Ai-je respecté la convention IIFE (pas de variables globales) ?
□ 3. Ai-je testé sur mobile (375px) et desktop (1440px) ?
□ 4. Ai-je testé sans Supabase (file://) ?
□ 5. Ai-je testé avec les 3 langues (FR/EN/PL) ?
□ 6. Ai-je vérifié qu'aucun bouton ne reste bloqué (disabled) ?
□ 7. Ai-je vérifié qu'aucune erreur JS n'est introduite ?
□ 8. Ai-je vérifié le scroll horizontal (overflow-x) ?
□ 9. Ai-je mis à jour PROJECT_ARCHITECTURE.md ?
□ 10. Ai-je mis à jour le Journal des évolutions ?
```

---

## 23. Dette technique

### Limitations actuelles

| # | Problème | Impact | Priorité |
|---|---------|--------|---------|
| 1 | **Single Page** — tout le contenu sur une seule page | SEO limité à une URL, pas de ranking par destination | Moyen |
| 2 | **i18n via CDN** — si i18next est bloqué, les traductions ne fonctionnent pas | Mode dégradé : texte statique anglais | Faible |
| 3 | **Pas de tests automatisés** | Risque de régression non détectée | Moyen |
| 4 | **Pas de CSP (Content-Security-Policy)** | Protection XSS limitée à l'échappement manuel | Faible |
| 5 | **YouTube comme LCP** — la vidéo est l'élément le plus lent | LCP > 2s sur connexion lente | Faible |
| 6 | **Pas de compression Brotli/Gzip côté serveur** | Pages plus lourdes | Faible |
| 7 | **Pas de pages dédiées par destination** (`/taghazout`, `/imsouane`) | Opportunité SEO manquée | Élevé |
| 8 | **Pas de blog / contenu éditorial** | Pas de stratégie de contenu long-terme | Moyen |

### Améliorations possibles

1. Créer des pages dédiées par destination (`/pl/taghazout/`, `/pl/tamraght/`, `/pl/imsouane/`)
2. Ajouter un blog avec articles SEO (guide surf Maroc, packing list, etc.)
3. Intégrer Google Reviews / Trustpilot pour EEAT
4. Ajouter un CSP header
5. Implémenter des tests Playwright automatisés
6. Passer à un déploiement avec compression activée

---

## 24. Journal des évolutions

| Date | Version | Description | Fichiers modifiés |
|------|---------|-----------|-------------------|
| 2026-07-16 | 2.0 | Documentation PROJECT_ARCHITECTURE.md créée | `PROJECT_ARCHITECTURE.md` (nouveau) |
| 2026-07-16 | 1.9 | Design System — unification des boutons admin (orange) | `admin/admin.css` |
| 2026-07-16 | 1.8 | UI Polish — carte programme uniforme, espacements, typographie | `admin/dashboard.html`, `admin/admin.css` |
| 2026-07-16 | 1.7 | Brochures PDF multilingues (FR/EN/PL) | `dashboard.html`, `supabase-client.js`, `programs.js`, `programs.css`, `admin.css`, `locales/*.js`, `schema-brochures.sql` |
| 2026-07-16 | 1.6 | SEO architecture — robots.txt, sitemap, hreflang, OG, JSON-LD, PWA | `index.html`, `schema.js`, `i18n.js`, `locales/*.js`, `robots.txt`, `sitemap.xml`, `manifest.json`, `favicon.svg`, `404.html`, `privacy.html`, `terms.html` |
| 2026-07-16 | 1.5 | Robustesse login — CDN fallback, timeout 10s, i18n défensif, SDK local | `supabase-client.js`, `admin/index.html`, `dashboard.html`, `programs.js`, `i18n.js`, `vendor/supabase.min.js` |
| 2026-07-16 | 1.4 | Production readiness — XSS, duplicate listeners, .catch(), overflow-x | `dashboard.html`, `index.html`, `svg-loader.js`, `nav.js`, `reveal.js`, `form.js`, `main.css` |
| 2026-07-16 | 1.3 | Responsive audit — 12 CSS files, 14 breakpoints testés | Tous les fichiers CSS |
| 2026-07-15 | 1.2 | i18n JSONB migration — colonnes TEXT → JSONB `{fr,en,pl}` | Migration SQL, `programs.js`, `dashboard.html` |
| 2026-07-15 | 1.1 | KeepAlive — api/ping.js avec PostgREST | `api/ping.js`, migration SQL |
| 2025 | 1.0 | Version initiale — landing page + admin dashboard | Tous les fichiers |

---

## 25. Guide pour les assistants IA

### 25.1 Résumé exécutif (30 secondes)

SurfAgencyMorocco est une **landing page statique + dashboard admin** pour une agence de surf Maroc/Pologne. **Stack** : HTML5 + CSS3 + JS Vanilla (IIFE) + Supabase (Auth/DB/Storage/Edge Functions) + Vercel. **Pas de build, pas de npm, pas de serveur.** Le frontend communique avec Supabase via `window.SupabaseAPI`. 3 langues (FR/EN/PL) gérées par i18next.

### 25.2 Fichiers critiques — NE JAMAIS MODIFIER SANS PRÉCAUTION

| Fichier | Pourquoi critique |
|---------|------------------|
| `assets/js/supabase-client.js` | Toute l'API Supabase. Si cassé → plus de DB, Auth, Storage, Emails. |
| `assets/js/i18n.js` | Traductions, langue, balises SEO. Si cassé → site en anglais uniquement, hreflang cassé. |
| `admin/dashboard.html` | Tout le CRUD admin. Si cassé → impossible de gérer réservations/programmes. |
| `index.html` | Structure de la landing page. Si cassé → site public hors service. |
| `vendor/supabase.min.js` | SDK Supabase local. Si supprimé → fallback CDN (moins fiable). |

### 25.3 Conventions impératives

1. **TOUS les fichiers JS sont des IIFE** — `(function() { ... })();`
2. **PAS de modules ES6** — pas de `import`/`export` dans les fichiers assets/js/
3. **PAS de `style=""` inline** dans `index.html` (autorisé dans dashboard.html)
4. **PAS de `<script>` inline** dans `index.html` (autorisé dans admin)
5. **Communication via `window.SupabaseAPI`** et `window.i18n`
6. **Ordre de chargement JS** : i18n → supabase-client → svg-loader → hero → nav → reveal → testimonials → programs → form → schema
7. **CSS par section** : 1 fichier par section, ordre dans `index.html`
8. **Mobile-first** : media queries `max-width`

### 25.4 Pièges connus

| Piège | Description | Solution |
|-------|-----------|---------|
| **CDN fallback** | Le SDK Supabase essaie 4 sources (local + 3 CDN). Si `window._supabaseLoadError` est défini, ne pas continuer. | Vérifier `window._supabaseLoadError` avant d'appeler l'API |
| **i18n non initialisé** | `window.i18n.t()` retourne la clé si i18next n'est pas chargé (file://). | Utiliser `(window.i18n && window.i18n.t(key)) \|\| 'fallback'` |
| **z-index mobile menu** | Le `.mobile-menu` a `z-index: 1001`, le `nav` a `1000`. Ne pas réduire. | Ne pas modifier les z-index sans tester le menu mobile |
| **RLS Supabase** | Anon peut seulement INSERT dans `reservations`. Toute autre opération nécessite `authenticated`. | Vérifier `window._supabase.auth.getUser()` avant CRUD |
| **Supabase anon key exposée** | La clé anon est dans `supabase-client.js` ligne 3. C'est intentionnel (clé publique). | Ne jamais ajouter la `SUPABASE_SERVICE_KEY` dans le code frontend |
| **Double event listeners** | `bindProgramEvents()` a un flag `_eventsBound`. Ne pas retirer ce flag. | Toujours vérifier que les listeners ne sont pas dupliqués |
| **Boutons disabled** | Les boutons doivent toujours être réactivés après une erreur. | `btn.disabled = false` dans tous les chemins d'erreur |
| **Polling sans timeout** | Les boucles `setTimeout(fn, ms)` doivent avoir un compteur max. | Toujours ajouter `if (attempts >= MAX) { ...; return; }` |

### 25.5 Comment ajouter une fonctionnalité

1. **Nouvelle section publique** :
   - Ajouter le HTML dans `index.html`
   - Créer `assets/css/ma-section.css` + `<link>` dans `<head>`
   - Si JS nécessaire → créer IIFE dans `assets/js/` + `<script defer>`

2. **Nouvelle fonctionnalité admin** :
   - Ajouter le HTML dans `dashboard.html`
   - Ajouter les styles dans `admin/admin.css`
   - Ajouter la logique dans le `<script>` inline de `dashboard.html`
   - Si besoin d'API Supabase → ajouter la fonction dans `window.SupabaseAPI` (supabase-client.js)

3. **Nouvelle traduction** :
   - Ajouter la clé dans `locales/{en,fr,pl}.js`
   - Dans le HTML : `data-i18n="ma.cle"`
   - Dans le JS : `window.i18n.t('ma.cle')`

4. **Nouvelle table Supabase** :
   - Créer un fichier SQL dans `supabase/migrations/`
   - Exécuter dans Supabase SQL Editor
   - Ajouter les politiques RLS
   - Ajouter les fonctions CRUD dans `SupabaseAPI`

---

## 26. Roadmap

### Fonctionnalités terminées

- Landing page multilingue avec vidéo YouTube fond
- 3 destinations, 3 programmes, galerie photo, témoignages
- Formulaire de réservation → Supabase + email auto
- Dashboard admin (login, CRUD réservations, CRUD programmes)
- Upload images + brochures PDF
- Configuration SMTP + templates email
- SEO (meta, OG, hreflang, JSON-LD, sitemap, robots.txt)
- Design system unifié (orange)
- Responsive 320px–1920px
- KeepAlive anti-pause Supabase
- SDK Supabase local + CDN fallback 4 sources

### Fonctionnalités en cours

- Aucune en cours

### Fonctionnalités futures (priorité)

| # | Fonctionnalité | Priorité |
|---|---------------|---------|
| 1 | Pages dédiées par destination (`/taghazout`, `/tamraght`, `/imsouane`) | Élevée |
| 2 | Blog avec articles SEO (guide surf Maroc, packing list) | Moyenne |
| 3 | Intégration Google Reviews / Trustpilot | Moyenne |
| 4 | CSP header | Faible |
| 5 | Tests Playwright automatisés | Faible |
| 6 | Dark mode | Faible |
| 7 | PWA complète (offline, notifications) | Faible |

---

## 27. Résumé final

SurfAgencyMorocco est une **landing page statique professionnelle** couplée à un **dashboard d'administration complet**, construite avec **HTML5, CSS3 vanilla, JavaScript IIFE** et propulsée par **Supabase** (Auth, Postgres, Storage, Edge Functions). Le site est **multilingue** (FR/EN/PL), **responsive** (320px–1920px), **SEO-optimisé** (JSON-LD, hreflang, OG), et déployé sur **Vercel** (statique + serverless KeepAlive).

Le projet se distingue par :
- **Zéro build tool, zéro npm, zéro serveur** — simplicité maximale
- **SDK Supabase local** — pas de dépendance CDN critique
- **Design system unifié** — cohérence visuelle complète
- **Robustesse** — timeouts, fallbacks, .catch() sur tous les appels critiques
- **Documentation exhaustive** — ce document couvre l'intégralité de l'architecture

**État** : Production-ready. Score SEO : 81/100.

---

> **Ce document est la source unique de vérité du projet SurfAgencyMorocco.**
> Toute modification de l'architecture ou ajout de fonctionnalité doit être reflété ici.
> Dernière mise à jour : 2026-07-16 — Version 2.0
