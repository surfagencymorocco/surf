# SurfAgencyMorocco

Landing page statique + panneau d'administration pour une agence de surf au Maroc.

## Architecture

```
SurfAgencyMorocco/
├── index.html                ← Page publique (HTML sémantique, zéro style/JS inline)
├── assets/
│   ├── css/                  ← 11 fichiers CSS (un par section + main + animations)
│   ├── js/                   ← 8 fichiers JS en IIFE (pas de modules ES6)
│   │   ├── supabase-client.js   ← Client Supabase + CRUD + auth + sendEmail
│   │   ├── svg-loader.js        ← Injecte le sprite SVG dans le DOM
│   │   ├── hero.js              ← Hero video autoplay
│   │   ├── nav.js               ← Scroll navbar + menu hamburger
│   │   ├── reveal.js            ← IntersectionObserver scroll reveal
│   │   ├── testimonials.js      ← Témoignages (réservé)
│   │   ├── programs.js          ← Charge les programmes depuis Supabase
│   │   └── form.js              ← Envoi formulaire → Supabase + email auto
│   └── icons/
│       └── sprite.svg           ← Tous les symboles SVG externalisés
├── admin/
│   ├── index.html             ← Connexion admin (Supabase Auth)
│   ├── dashboard.html         ← Dashboard (réservations, programmes, email)
│   ├── admin.css              ← Styles du panneau admin
│   └── schema.sql             ← Référence SQL (tables, RLS, storage)
├── .env                       ← Credentials Supabase (gitignoré)
└── env.example                ← Template du .env
```

## Utilisation

Ouvrir `index.html` dans un navigateur (file:// ou serveur statique).

Admin : ouvrir `admin/index.html` et se connecter avec les identifiants Supabase Auth.

## Fonctionnalités

- Réservation via formulaire → stockée dans Supabase (table `reservations`)
- Email automatique au client après réservation (template "pending")
- Dashboard admin : gestion des réservations (statut Confirmé/Annulé/Supprimé)
  - Changement de statut → email automatique au client
- Gestion des programmes (CRUD avec upload d'image via Supabase Storage)
- Configuration SMTP + templates d'email personnalisables
- Programmes dynamiques : les modifications admin s'affichent sur la page publique

## Dépendances

Aucune build. Le client Supabase est chargé via CDN (unpkg).
Les polices sont servies par Google Fonts.
Les images utilisent Unsplash (hotlinks) + Supabase Storage.

## Contact

info@surfagencymorocco.com | +48 662 763 381
