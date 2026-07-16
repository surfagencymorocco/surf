(function() {
  var lang = (window.i18n && window.i18n.currentLang) || 'pl';
  var baseUrl = 'https://surfagencymorocco.com';

  var localized = function(obj, l) {
    l = l || lang;
    if (!obj) return '';
    if (typeof obj === 'object' && !Array.isArray(obj)) return obj[l] || obj.en || obj.fr || Object.values(obj).find(function(v){return v;}) || '';
    return String(obj);
  };

  var destNames = {
    taghazout: { en: 'Taghazout', fr: 'Taghazout', pl: 'Taghazout' },
    tamraght: { en: 'Tamraght', fr: 'Tamraght', pl: 'Tamraght' },
    imsouane: { en: 'Imsouane', fr: 'Imsouane', pl: 'Imsouane' }
  };

  var destDescs = {
    taghazout: {
      en: 'World-class point breaks like Anchor Point and Hash Point. The jewel of Moroccan surfing for advanced and intermediate surfers.',
      fr: 'Point breaks de classe mondiale comme Anchor Point et Hash Point. Le joyau du surf marocain pour surfeurs avancés et intermédiaires.',
      pl: 'Światowej klasy point breaki jak Anchor Point i Hash Point. Perła marokańskiego surfingu dla zaawansowanych i średniozaawansowanych.'
    },
    tamraght: {
      en: 'Authentic Berber fishing village with consistent beach breaks. Ideal for all levels, especially progression.',
      fr: 'Village de pêcheurs berbère authentique avec des beach breaks constants. Idéal pour tous les niveaux.',
      pl: 'Autentyczna berberyjska wioska rybacka ze stałymi beach breakami. Idealna dla wszystkich poziomów.'
    },
    imsouane: {
      en: 'Home to the longest wave in Africa — a 700-metre right-hander. Perfect for beginners with a relaxed bay atmosphere.',
      fr: 'La plus longue vague d\'Afrique — une droite de 700 mètres. Parfaite pour les débutants.',
      pl: 'Dom najdłuższej fali w Afryce — 700-metrowa prawostronna fala. Idealna dla początkujących.'
    }
  };

  var reviewItems = [
    { name: 'Tom R.', origin: 'Paris, France', text: {
      en: 'Taghazout completely blew my mind. The waves, the people, the food — I\'ve been surfing for 10 years and this was hands-down the best surf trip I\'ve ever taken.',
      fr: 'Taghazout m\'a complètement époustouflé. Je surfe depuis 10 ans et c\'était sans conteste le meilleur trip surf.',
      pl: 'Taghazout kompletnie mnie zachwyciło. Surfuję od 10 lat i to był bez dwóch zdań najlepszy surf trip.'
    }},
    { name: 'Sarah M.', origin: 'Berlin, Germany', text: {
      en: 'Never surfed before in my life. In 8 days I was riding waves solo. The instructors were incredibly patient. Imsouane is magical for beginners!',
      fr: 'Je n\'avais jamais surfé. En 8 jours, je surfais en solo. Les instructeurs étaient incroyablement patients.',
      pl: 'Nigdy wcześniej nie surfowałem. W 8 dni pływałem na falach solo. Instruktorzy byli niesamowicie cierpliwi.'
    }},
    { name: 'James K.', origin: 'London, UK', text: {
      en: 'The video coaching at Tamraght took my surfing to another level. Watching my sessions and getting feedback changed everything.',
      fr: 'Le coaching vidéo à Tamraght a fait passer mon surf au niveau supérieur. Analyser mes sessions a tout changé.',
      pl: 'Coaching wideo w Tamraght wyniósł mój surfing na wyższy poziom. Oglądanie sesji i informacje zwrotne zmieniły wszystko.'
    }},
    { name: 'Lucia V.', origin: 'Barcelona, Spain', text: {
      en: 'The riad accommodation, the tagines every night, the sunsets on the Atlantic... Morocco won my heart completely.',
      fr: 'L\'hébergement en riad, les tajines chaque soir, les couchers de soleil sur l\'Atlantique... Le Maroc a conquis mon cœur.',
      pl: 'Zakwaterowanie w riadzie, tajine każdego wieczoru, zachody słońca nad Atlantykiem... Maroko całkowicie podbiło moje serce.'
    }},
    { name: 'Erik L.', origin: 'Amsterdam, NL', text: {
      en: 'Anchor Point at sunrise with only our group in the water. I\'ll remember that session for the rest of my life.',
      fr: 'Anchor Point au lever du soleil avec seulement notre groupe à l\'eau. Je me souviendrai de cette session toute ma vie.',
      pl: 'Anchor Point o wschodzie słońca, tylko nasza grupa w wodzie. Będę pamiętał tę sesję do końca życia.'
    }}
  ];

  var faqItems = [
    { q: { en: 'What is the best season for surfing in Morocco?', fr: 'Quelle est la meilleure saison pour surfer au Maroc ?', pl: 'Jaki jest najlepszy sezon na surfing w Maroku?' },
      a: { en: 'High season is October to April with powerful Atlantic swells (1–4 metres). Beginner season is May to September with smaller, gentle waves and warm water.', fr: 'La haute saison est d\'octobre à avril avec de puissantes houles atlantiques (1–4 mètres). La saison débutants est de mai à septembre.', pl: 'Wysoki sezon trwa od października do kwietnia z potężnymi atlantyckimi falami (1–4 metry). Sezon dla początkujących trwa od maja do września.' }},
    { q: { en: 'How much does a surf camp in Morocco cost?', fr: 'Combien coûte un camp de surf au Maroc ?', pl: 'Ile kosztuje obóz surfingowy w Maroku?' },
      a: { en: 'Our 8-day all-inclusive surf camps start from 550 EUR per person for the beginner camp in Imsouane, 650 EUR for intermediate in Tamraght, and 750 EUR for advanced in Taghazout.', fr: 'Nos camps tout inclus de 8 jours commencent à 550€ par personne pour le camp débutant à Imsouane, 650€ pour intermédiaire à Tamraght, et 750€ pour avancé à Taghazout.', pl: 'Nasze 8-dniowe obozy all-inclusive zaczynają się od 550 EUR za osobę za obóz dla początkujących w Imsouane, 650 EUR za średniozaawansowany w Tamraght i 750 EUR za zaawansowany w Taghazout.' }},
    { q: { en: 'Do I need a wetsuit for surfing in Morocco?', fr: 'Ai-je besoin d\'une combinaison pour surfer au Maroc ?', pl: 'Czy potrzebuję pianki do surfowania w Maroku?' },
      a: { en: 'A 3/2mm wetsuit is recommended during high season (October–April). In summer (May–September), the water is warm enough to surf without a wetsuit.', fr: 'Une combinaison 3/2mm est recommandée en haute saison (octobre–avril). En été (mai–septembre), l\'eau est assez chaude pour surfer sans combinaison.', pl: 'Pianka 3/2mm jest zalecana w wysokim sezonie (październik–kwiecień). Latem (maj–wrzesień) woda jest wystarczająco ciepła, aby surfować bez pianki.' }},
    { q: { en: 'Can beginners join the surf camp?', fr: 'Les débutants peuvent-ils participer au camp de surf ?', pl: 'Czy początkujący mogą dołączyć do obozu surfingowego?' },
      a: { en: 'Absolutely! Our beginner camp in Imsouane is designed for first-time surfers. We provide all equipment and certified instructors. Maximum 8 people per group for personalized attention.', fr: 'Absolument ! Notre camp débutant à Imsouane est conçu pour les débutants. Nous fournissons tout l\'équipement et des instructeurs certifiés.', pl: 'Oczywiście! Nasz obóz dla początkujących w Imsouane jest zaprojektowany dla osób surfujących po raz pierwszy. Zapewniamy cały sprzęt i certyfikowanych instruktorów.' }},
    { q: { en: 'What is included in the 8-day surf camp?', fr: 'Qu\'est-ce qui est inclus dans le camp de surf de 8 jours ?', pl: 'Co jest wliczone w 8-dniowy obóz surfingowy?' },
      a: { en: 'The package includes 7 nights accommodation, daily breakfast and dinner, 2 surf sessions per day, all equipment (board + wetsuit), certified local instructors, airport transfers, and video analysis (intermediate/advanced).', fr: 'Le forfait comprend 7 nuits d\'hébergement, petit-déjeuner et dîner quotidiens, 2 sessions de surf par jour, tout l\'équipement, instructeurs certifiés, transferts aéroport.', pl: 'Pakiet obejmuje 7 nocy zakwaterowania, codzienne śniadanie i kolację, 2 sesje surfowania dziennie, cały sprzęt, certyfikowanych instruktorów, transfery lotniskowe.' }},
    { q: { en: 'Where exactly are the surf camps located?', fr: 'Où se trouvent exactement les camps de surf ?', pl: 'Gdzie dokładnie znajdują się obozy surfingowe?' },
      a: { en: 'We operate in three legendary Moroccan surf destinations: Taghazout (Anchor Point, Hash Point — advanced), Tamraght (beach breaks — all levels), and Imsouane (the longest wave in Africa — beginner-friendly).', fr: 'Nous opérons dans trois destinations de surf marocaines légendaires : Taghazout (Anchor Point, Hash Point — avancé), Tamraght (beach breaks — tous niveaux) et Imsouane (la plus longue vague d\'Afrique — débutants).', pl: 'Działamy w trzech legendarnych marokańskich destynacjach surfingowych: Taghazout (Anchor Point, Hash Point — zaawansowany), Tamraght (beach breaki — wszystkie poziomy) i Imsouane (najdłuższa fala w Afryce — początkujący).' }},
    { q: { en: 'How do I book a surf camp?', fr: 'Comment réserver un camp de surf ?', pl: 'Jak zarezerwować obóz surfingowy?' },
      a: { en: 'Fill in the booking form on our website, contact us via email at info@surfagencymorocco.com, or message us on WhatsApp at +48 662 763 381. We reply within 24 hours with a personalized quote.', fr: 'Remplissez le formulaire sur notre site, contactez-nous par email à info@surfagencymorocco.com ou par WhatsApp au +48 662 763 381.', pl: 'Wypełnij formularz rezerwacji na naszej stronie, skontaktuj się przez email info@surfagencymorocco.com lub przez WhatsApp +48 662 763 381. Odpowiadamy w ciągu 24 godzin.' }},
    { q: { en: 'Which surf camp is best for me?', fr: 'Quel camp de surf est le mieux pour moi ?', pl: 'Który obóz surfingowy jest dla mnie najlepszy?' },
      a: { en: 'Imsouane for beginners (never surfed), Tamraght for intermediates (1–3 years experience), Taghazout for advanced surfers (3+ years). All camps include small groups of max 8 people.', fr: 'Imsouane pour débutants, Tamraght pour intermédiaires (1–3 ans), Taghazout pour avancés (3+ ans). Tous les camps incluent des petits groupes de max 8 personnes.', pl: 'Imsouane dla początkujących, Tamraght dla średniozaawansowanych (1–3 lata doświadczenia), Taghazout dla zaawansowanych (3+ lat). Wszystkie obozy obejmują małe grupy max 8 osób.' }}
  ];

  function buildSchema() {
    var schemas = [];

    // 1. Organization
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': baseUrl + '/#organization',
      name: 'SurfAgencyMorocco',
      url: baseUrl,
      logo: baseUrl + '/assets/favicon.svg',
      description: localized({ en: 'Authentic surf travel experience in Morocco since 2018. Guiding surfers to the best Atlantic waves.', fr: 'Expérience de surf authentique au Maroc depuis 2018.', pl: 'Autentyczne doświadczenie surf travel w Maroku od 2018 roku.' }),
      foundingDate: '2018',
      email: 'info@surfagencymorocco.com',
      telephone: '+48662763381',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Wrocławska 5A',
        postalCode: '30-006',
        addressLocality: 'Kraków',
        addressCountry: 'PL'
      },
      sameAs: [
        'https://www.instagram.com/surfagencymorocco/',
        'https://www.facebook.com/surfagencymorocco/',
        'https://wa.me/48662763381'
      ]
    });

    // 2. TravelAgency
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      '@id': baseUrl + '/#travelagency',
      name: 'SurfAgencyMorocco',
      url: baseUrl,
      description: localized({ en: 'Morocco\'s most authentic surf travel experience. 8-day all-inclusive surf camps in Taghazout, Tamraght & Imsouane.', fr: 'L\'expérience de surf la plus authentique du Maroc. Camps de surf tout inclus de 8 jours.', pl: 'Najbardziej autentyczne doświadczenie surf travel w Maroku. 8-dniowe obozy surfingowe all-inclusive.' }),
      areaServed: [
        { '@type': 'Country', name: 'Poland' },
        { '@type': 'Country', name: 'France' },
        { '@type': 'Country', name: 'Germany' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Spain' },
        { '@type': 'Country', name: 'Netherlands' },
        { '@type': 'Country', name: 'Italy' },
        { '@type': 'Country', name: 'Belgium' },
        { '@type': 'Country', name: 'Portugal' }
      ],
      priceRange: '€550 – €750',
      parentOrganization: { '@id': baseUrl + '/#organization' }
    });

    // 3. LocalBusiness
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': baseUrl + '/#localbusiness',
      name: 'SurfAgencyMorocco',
      image: baseUrl + '/assets/favicon.svg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Wrocławska 5A',
        postalCode: '30-006',
        addressLocality: 'Kraków',
        addressCountry: 'PL'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 50.04023,
        longitude: 19.96247
      },
      telephone: '+48662763381',
      email: 'info@surfagencymorocco.com',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      sameAs: [
        'https://www.instagram.com/surfagencymorocco/',
        'https://www.facebook.com/surfagencymorocco/'
      ]
    });

    // 4. WebSite
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': baseUrl + '/#website',
      url: baseUrl,
      name: 'SurfAgencyMorocco',
      inLanguage: ['pl', 'en', 'fr'],
      potentialAction: {
        '@type': 'SearchAction',
        target: baseUrl + '/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      publisher: { '@id': baseUrl + '/#organization' }
    });

    // 5. WebPage
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': baseUrl + (lang === 'pl' ? '/?lang=pl' : lang === 'fr' ? '/?lang=fr' : '/?lang=en') + '#webpage',
      url: baseUrl + (lang === 'pl' ? '/?lang=pl' : lang === 'fr' ? '/?lang=fr' : '/?lang=en'),
      name: localized({ en: 'SurfAgencyMorocco — 8-Day Surf Camps in Morocco', fr: 'SurfAgencyMorocco — Camps de Surf 8 Jours au Maroc', pl: 'SurfAgencyMorocco — Obozy Surfingowe 8 Dni w Maroku' }),
      description: localized({ en: 'All-inclusive surf camps in Taghazout, Tamraght & Imsouane. 8 days from €550.', fr: 'Camps de surf tout inclus à Taghazout, Tamraght & Imsouane. 8 jours dès 550€.', pl: 'Obozy surfingowe all-inclusive w Taghazout, Tamraght & Imsouane. 8 dni od 550€.' }),
      inLanguage: lang,
      isPartOf: { '@id': baseUrl + '/#website' },
      about: { '@id': baseUrl + '/#travelagency' },
      breadcrumb: { '@id': baseUrl + '/#breadcrumb' }
    });

    // 6. BreadcrumbList
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': baseUrl + '/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: localized({ en: 'Home', fr: 'Accueil', pl: 'Strona Główna' }),
          item: baseUrl + '/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: localized({ en: 'Destinations', fr: 'Destinations', pl: 'Destynacje' }),
          item: baseUrl + '/#destinations'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: localized({ en: 'Programs', fr: 'Programmes', pl: 'Programy' }),
          item: baseUrl + '/#programs'
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: localized({ en: 'Book Now', fr: 'Réserver', pl: 'Rezerwuj' }),
          item: baseUrl + '/#booking'
        }
      ]
    });

    // 7. TouristDestination x3
    ['taghazout', 'tamraght', 'imsouane'].forEach(function(dest) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: localized(destNames[dest]),
        description: localized(destDescs[dest]),
        touristType: 'Surfing',
        containedInPlace: {
          '@type': 'Country',
          name: 'Morocco'
        }
      });
    });

    // 8. Offer x3
    var programs = [
      { name: {en:'Beginner Surf Camp – Imsouane',fr:'Camp Débutant – Imsouane',pl:'Obóz Początkujący – Imsouane'}, price: 550, level: 'beginner' },
      { name: {en:'Intermediate Surf Camp – Tamraght',fr:'Camp Intermédiaire – Tamraght',pl:'Obóz Średniozaawansowany – Tamraght'}, price: 650, level: 'intermediate' },
      { name: {en:'Advanced Surf Trip – Taghazout',fr:'Trip Avancé – Taghazout',pl:'Wyprawa Zaawansowana – Taghazout'}, price: 750, level: 'advanced' }
    ];

    programs.forEach(function(p) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: localized(p.name),
        price: p.price + '.00',
        priceCurrency: 'EUR',
        description: localized({ en: '8-day all-inclusive surf camp in Morocco. Accommodation, meals, daily surf sessions, equipment, certified instructors.', fr: 'Camp de surf tout inclus de 8 jours au Maroc. Hébergement, repas, sessions quotidiennes, équipement, instructeurs certifiés.', pl: '8-dniowy obóz surfingowy all-inclusive w Maroku. Zakwaterowanie, posiłki, codzienne sesje, sprzęt, certyfikowani instruktorzy.' }),
        availability: 'https://schema.org/InStock',
        category: 'Surf Camp',
        seller: { '@id': baseUrl + '/#organization' }
      });
    });

    // 9. Service
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: localized({ en: '8-Day All-Inclusive Surf Camp', fr: 'Camp de Surf Tout Inclus 8 Jours', pl: '8-Dniowy Obóz Surfingowy All-Inclusive' }),
      description: localized({ en: 'Small groups (max 8), 2 daily surf sessions, all equipment, accommodation, meals, video coaching, airport transfers. 3 destinations across Morocco.', fr: 'Petits groupes (max 8), 2 sessions/jour, tout équipement, hébergement, repas, coaching vidéo, transferts.', pl: 'Małe grupy (max 8), 2 sesje dziennie, cały sprzęt, zakwaterowanie, posiłki, coaching wideo, transfery lotniskowe.' }),
      provider: { '@id': baseUrl + '/#organization' },
      areaServed: [
        { '@type': 'Country', name: 'Morocco' },
        { '@type': 'Country', name: 'Poland' }
      ],
      offers: { '@type': 'Offer', price: '550.00', priceCurrency: 'EUR', minPrice: '550.00', maxPrice: '750.00' }
    });

    // 10. AggregateRating
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: 5,
      itemReviewed: { '@id': baseUrl + '/#travelagency' }
    });

    // 11. Review x5
    reviewItems.forEach(function(r) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        reviewBody: localized(r.text),
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
        itemReviewed: { '@id': baseUrl + '/#travelagency' }
      });
    });

    // 12. ContactPoint
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+48662763381',
      email: 'info@surfagencymorocco.com',
      availableLanguage: ['Polish', 'English', 'French'],
      areaServed: ['PL', 'FR', 'DE', 'GB', 'ES', 'NL', 'IT', 'BE', 'PT'],
      contactOption: ['TollFree', 'WhatsApp']
    });

    // 13. ImageObject x3 (destination images)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: baseUrl + '/images/the-magic-bay.jpg',
      caption: localized({ en: 'Imsouane surf camp — beginner-friendly waves', pl: 'Obóz surfingowy Imsouane — fale przyjazne początkującym' })
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: baseUrl + '/images/2024-12-10.webp',
      caption: localized({ en: 'Taghazout advanced surf trip — world-class waves', pl: 'Zaawansowana wyprawa surfingowa Taghazout — fale światowej klasy' })
    });

    // 14. VideoObject
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: localized({ en: 'SurfAgencyMorocco — Surf Camp Experience', pl: 'SurfAgencyMorocco — Doświadczenie Obozu Surfingowego' }),
      description: localized({ en: '8-day all-inclusive surf camp experience on the Atlantic coast of Morocco.', pl: '8-dniowe all-inclusive doświadczenie obozu surfingowego na atlantyckim wybrzeżu Maroka.' }),
      thumbnailUrl: 'https://img.youtube.com/vi/BUzkCs2B9OY/maxresdefault.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=BUzkCs2B9OY',
      embedUrl: 'https://www.youtube.com/embed/BUzkCs2B9OY',
      uploadDate: '2024-01-01'
    });

    // 15. FAQPage
    var mainEntity = faqItems.map(function(item, idx) {
      return {
        '@type': 'Question',
        name: localized(item.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: localized(item.a)
        }
      };
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: mainEntity
    });

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemas, null, 0);
    document.head.appendChild(script);
  }

  buildSchema();
})();
