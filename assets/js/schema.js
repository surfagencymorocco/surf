(function() {
  var lang = (window.i18n && window.i18n.currentLang) || 'en';
  var baseUrl = 'https://surfagencymorocco.com';

  var l10n = function(obj, l) {
    l = l || lang;
    if (!obj) return '';
    if (typeof obj === 'object' && !Array.isArray(obj)) return obj[l] || obj.en || obj.fr || obj.pl || Object.values(obj).find(function(v){return v;}) || '';
    return String(obj);
  };

  // ── DESTINATION DATA ──
  var dests = {
    taghazout: {
      name: {en:'Taghazout',fr:'Taghazout',pl:'Taghazout'},
      desc: {en:'World-class point breaks including Anchor Point and Hash Point. The crown jewel of Moroccan surfing for advanced and intermediate surfers.',fr:'Point breaks de classe mondiale dont Anchor Point et Hash Point. Le joyau du surf marocain pour surfeurs avances et intermediaires.',pl:'Swiatowej klasy point breaki, w tym Anchor Point i Hash Point. Perla marokanskiego surfingu dla zaawansowanych i sredniozaawansowanych.'},
      geo: {lat:30.5451,lon:-9.7105}
    },
    tamraght: {
      name: {en:'Tamraght',fr:'Tamraght',pl:'Tamraght'},
      desc: {en:'Authentic Berber fishing village with consistent beach breaks. Ideal for all levels, especially surf progression.',fr:'Village de pecheurs berbere authentique avec des beach breaks constants. Ideal pour tous les niveaux, surtout la progression.',pl:'Autentyczna berberyjska wioska rybacka ze stalymi beach breakami. Idealna dla wszystkich poziomow, szczegolnie progresji.'},
      geo: {lat:30.5128,lon:-9.6762}
    },
    imsouane: {
      name: {en:'Imsouane',fr:'Imsouane',pl:'Imsouane'},
      desc: {en:'Home to the longest wave in Africa — a 700-metre right-hander. Perfect for beginners with a relaxed bay atmosphere and long, gentle rides.',fr:'La plus longue vague d\'Afrique — une droite de 700 metres. Parfaite pour les debutants avec une atmospherie de baie detendue.',pl:'Dom najdluzszej fali w Afryce — 700-metrowa prawostronna fala. Idealna dla poczatkujacych ze spokojna atmosfera zatoki.'},
      geo: {lat:31.0022,lon:-9.8799}
    }
  };

  // ── PROGRAM DATA ──
  var programs = [
    {id:'imsouane',name:{en:'Imsouane Surf Camp — Beginner',fr:'Camp Debutant Imsouane',pl:'Obóz Imsouane — Poczatkujacy'},desc:{en:'8-day all-inclusive beginner surf camp in Imsouane. 2 daily sessions, all equipment, certified instructors, small groups of 8.',fr:'Camp debutant tout inclus 8 jours a Imsouane. 2 sessions/jour, tout equipement, instructeurs certifies, petits groupes de 8.',pl:'8-dniowy obóz dla poczatkujacych all-inclusive w Imsouane. 2 sesje dziennie, caly sprzet, certyfikowani instruktorzy, male grupy 8 osob.'},price:550,level:'beginner',image:'images/the-magic-bay.jpg'},
    {id:'tamraght',name:{en:'Tamraght Surf Camp — Intermediate',fr:'Camp Intermediaire Tamraght',pl:'Obóz Tamraght — Sredniozaawansowany'},desc:{en:'8-day all-inclusive intermediate surf camp in Tamraght. Video coaching, expert surf guiding, daily forecasting, all meals included.',fr:'Camp intermediaire tout inclus 8 jours a Tamraght. Coaching video, guidage expert, briefings quotidiens, tous les repas inclus.',pl:'8-dniowy obóz sredniozaawansowany all-inclusive w Tamraght. Coaching wideo, eksperckie prowadzenie, codzienne prognozy, wszystkie posilki.'},price:650,level:'intermediate',image:'images/2024-11-05.webp'},
    {id:'taghazout',name:{en:'Taghazout Surf Trip — Advanced',fr:'Trip Avance Taghazout',pl:'Wyprawa Taghazout — Zaawansowany'},desc:{en:'8-day all-inclusive advanced surf trip in Taghazout. Access to premium spots, secret locations, sunrise sessions, pro photography.',fr:'Trip avance tout inclus 8 jours a Taghazout. Acces aux spots premium, spots secrets, sessions lever du soleil, photographie pro.',pl:'8-dniowa wyprawa zaawansowana all-inclusive w Taghazout. Dostep do premium spotów, tajne lokalizacje, sesje o wschodzie slonca, profesjonalna fotografia.'},price:750,level:'advanced',image:'images/2024-12-10.webp'}
  ];

  // ── REVIEW DATA ──
  var reviews = [
    {name:'Tom R.',origin:'Paris',text:{en:'Taghazout completely blew my mind. The waves, the people, the food — I have been surfing for 10 years and this was hands-down the best surf trip I have ever taken.',fr:'Taghazout m\'a completement epoustoufle. Je surfe depuis 10 ans et c\'etait sans conteste le meilleur trip surf.',pl:'Taghazout kompletnie mnie zachwycilo. Surfuje od 10 lat i to byl bez dwoch zdan najlepszy surf trip.'}},
    {name:'Sarah M.',origin:'Berlin',text:{en:'Never surfed before in my life. In 8 days I was riding waves solo. The instructors were incredibly patient. Imsouane is magical for beginners!',fr:'Je n\'avais jamais surfe. En 8 jours, je surfais en solo. Les instructeurs etaient incroyablement patients. Imsouane est magique!',pl:'Nigdy wczesniej nie surfowalem. W 8 dni plywalem na falach solo. Instruktorzy byli niesamowicie cierpliwi. Imsouane jest magiczne!'}},
    {name:'James K.',origin:'London',text:{en:'The video coaching at Tamraght took my surfing to another level. Watching my sessions and getting feedback changed everything.',fr:'Le coaching video a Tamraght a fait passer mon surf au niveau superieur. Analyser mes sessions a tout change.',pl:'Coaching wideo w Tamraght wyniósl mój surfing na wyzszy poziom. Ogladanie sesji i informacje zwrotne zmienily wszystko.'}},
    {name:'Lucia V.',origin:'Barcelona',text:{en:'The riad accommodation, the tagines every night, the sunsets on the Atlantic... Morocco won my heart completely.',fr:'L\'hebergement en riad, les tajines chaque soir, les couchers de soleil sur l\'Atlantique... Le Maroc a conquis mon coeur.',pl:'Zakwaterowanie w riadzie, tajine kazdego wieczoru, zachody slonca nad Atlantykiem... Maroko calkowicie podbilo moje serce.'}},
    {name:'Erik L.',origin:'Amsterdam',text:{en:'Anchor Point at sunrise with only our group in the water. I will remember that session for the rest of my life.',fr:'Anchor Point au lever du soleil avec seulement notre groupe a l\'eau. Je me souviendrai de cette session toute ma vie.',pl:'Anchor Point o wschodzie slonca, tylko nasza grupa w wodzie. Bede pamietal te sesje do konca zycia.'}}
  ];

  // ── FAQ DATA ──
  var faqs = [
    {q:{en:'What is the best season for surfing in Morocco?',fr:'Quelle est la meilleure saison pour surfer au Maroc ?',pl:'Jaki jest najlepszy sezon na surfing w Maroku?'},a:{en:'October to April brings powerful Atlantic swells (1–4 m). May to September offers smaller, gentle waves perfect for beginners with warm water temperatures.',fr:'Octobre a avril apporte de puissantes houles atlantiques (1–4 m). Mai a septembre offre des vagues plus douces, parfaites pour les debutants.',pl:'Od pazdziernika do kwietnia potężne atlantyckie fale (1–4 m). Od maja do wrzesnia mniejsze, lagodne fale idealne dla poczatkujacych.'}},
    {q:{en:'How much does a surf camp in Morocco cost?',fr:'Combien coute un camp de surf au Maroc ?',pl:'Ile kosztuje obóz surfingowy w Maroku?'},a:{en:'Our 8-day all-inclusive surf camps start at €550 per person (Imsouane beginner), €650 (Tamraght intermediate), and €750 (Taghazout advanced). All equipment, meals, accommodation, and coaching included.',fr:'Nos camps tout inclus de 8 jours commencent a 550€ (Imsouane debutant), 650€ (Tamraght intermediaire) et 750€ (Taghazout avance). Tout inclus.',pl:'Nasze 8-dniowe obozy all-inclusive zaczynaja sie od 550€ (Imsouane poczatkujacy), 650€ (Tamraght sredniozaawansowany) i 750€ (Taghazout zaawansowany). Wszystko wliczone.'}},
    {q:{en:'Do beginners need surfing experience?',fr:'Les debutants ont-ils besoin d\'experience ?',pl:'Czy poczatkujacy potrzebuja doswiadczenia?'},a:{en:'No experience needed. Our Imsouane beginner camp is designed for first-time surfers with certified instructors, calm bay waves, and all equipment provided. Maximum 8 people per group.',fr:'Aucune experience necessaire. Notre camp debutant a Imsouane est concu pour les debutants avec instructeurs certifies et tout l\'equipement fourni.',pl:'Zadne doswiadczenie nie jest wymagane. Nasz obóz dla poczatkujacych w Imsouane jest zaprojektowany dla surfujacych po raz pierwszy.'}},
    {q:{en:'What is included in the 8-day surf package?',fr:'Qu\'est-ce qui est inclus dans le forfait 8 jours ?',pl:'Co jest wliczone w pakiet 8-dniowy?'},a:{en:'7 nights accommodation, daily breakfast and dinner, 2 surf sessions per day, all equipment (board + wetsuit), certified local instructors, airport transfers, and video analysis for intermediate/advanced camps.',fr:'7 nuits, petit-dejeuner et diner, 2 sessions/jour, tout equipement, instructeurs certifies, transferts aeroport, analyse video (intermediaire/avance).',pl:'7 nocy, codzienne sniadanie i kolacja, 2 sesje dziennie, caly sprzet, certyfikowani instruktorzy, transfery lotniskowe, analiza wideo (srednio/zaawansowany).'}},
    {q:{en:'Where are the surf camps located in Morocco?',fr:'Ou se trouvent les camps de surf au Maroc ?',pl:'Gdzie znajduja sie obozy surfingowe w Maroku?'},a:{en:'Taghazout (Anchor Point — advanced), Tamraght (beach breaks — all levels), and Imsouane (the longest wave in Africa — beginner-friendly). All on Morocco\'s Atlantic coast near Agadir.',fr:'Taghazout (Anchor Point — avance), Tamraght (beach breaks — tous niveaux) et Imsouane (la plus longue vague d\'Afrique — debutants). Sur la cote atlantique pres d\'Agadir.',pl:'Taghazout (Anchor Point — zaawansowany), Tamraght (beach breaki — wszystkie poziomy) i Imsouane (najdluzsza fala w Afryce — poczatkujacy). Na atlantyckim wybrzezu niedaleko Agadiru.'}},
    {q:{en:'How do I book a surf camp?',fr:'Comment reserver un camp de surf ?',pl:'Jak zarezerwowac obóz surfingowy?'},a:{en:'Fill in the booking form on our website, email info@surfagencymorocco.com, or WhatsApp +48 662 763 381. We reply within 24 hours with a personalized quote for your surf holiday.',fr:'Remplissez le formulaire, envoyez un email a info@surfagencymorocco.com ou WhatsApp +48 662 763 381. Reponse sous 24h.',pl:'Wypelnij formularz, wyslij email na info@surfagencymorocco.com lub WhatsApp +48 662 763 381. Odpowiadamy w ciagu 24h.'}},
    {q:{en:'Which surf camp is right for my level?',fr:'Quel camp de surf correspond a mon niveau ?',pl:'Który obóz surfingowy jest dla mnie odpowiedni?'},a:{en:'Never surfed? Choose Imsouane (beginner, €550). Surfed 1–3 years? Tamraght (intermediate, €650) with video coaching. 3+ years? Taghazout (advanced, €750) with premium spots and pro photography.',fr:'Jamais surfe ? Imsouane (debutant, 550€). 1–3 ans ? Tamraght (intermediaire, 650€) avec coaching video. 3+ ans ? Taghazout (avance, 750€) avec spots premium.',pl:'Nigdy nie surfowales? Imsouane (poczatkujacy, 550€). 1–3 lata? Tamraght (sredniozaawansowany, 650€). 3+ lat? Taghazout (zaawansowany, 750€).'}},
    {q:{en:'Why choose a surf camp in Morocco over other destinations?',fr:'Pourquoi choisir un camp de surf au Maroc ?',pl:'Dlaczego warto wybrac obóz surfingowy w Maroku?'},a:{en:'Morocco offers year-round surf with warm weather, consistent Atlantic swells, 300+ sunny days annually, short flights from Europe (3–4 hours), affordable prices, and rich Berber culture. No jet lag from Europe.',fr:'Le Maroc offre du surf toute l\'annee, 300+ jours de soleil, vols courts depuis l\'Europe (3–4h), prix abordables et une riche culture berbere. Pas de decalage horaire.',pl:'Maroko oferuje surfing przez caly rok, 300+ slonecznych dni, krótkie loty z Europy (3–4h), przystepne ceny i bogata kulture berberyjska. Brak jet lagu z Europy.'}}
  ];

  function build() {
    var schemas = [];

    // 1. Organization
    schemas.push({
      '@context':'https://schema.org','@type':'Organization','@id':baseUrl+'/#org',
      name:'SurfAgencyMorocco',url:baseUrl,logo:baseUrl+'/assets/favicon.svg',
      description:l10n({en:'Authentic surf travel in Morocco. 8-day all-inclusive surf camps for European travelers in Taghazout, Tamraght and Imsouane.',fr:'Voyage surf authentique au Maroc. Camps tout inclus 8 jours a Taghazout, Tamraght et Imsouane.',pl:'Autentyczne podróze surfingowe w Maroku. 8-dniowe obozy all-inclusive w Taghazout, Tamraght i Imsouane.'}),
      foundingDate:'2018',email:'info@surfagencymorocco.com',telephone:'+48662763381',
      address:{'@type':'PostalAddress',streetAddress:'ul. Wroclawska 5A',postalCode:'30-006',addressLocality:'Kraków',addressCountry:'PL'},
      sameAs:['https://www.instagram.com/surfagencymorocco/','https://www.facebook.com/surfagencymorocco/','https://wa.me/48662763381']
    });

    // 2. TravelAgency
    schemas.push({
      '@context':'https://schema.org','@type':'TravelAgency','@id':baseUrl+'/#agency',
      name:'SurfAgencyMorocco',url:baseUrl,
      description:l10n({en:'Premium surf travel agency in Morocco. 8-day all-inclusive surf camps, surf coaching, and authentic surf holidays for European travelers.',fr:'Agence de surf premium au Maroc. Camps tout inclus 8 jours, coaching surf et vacances surf authentiques.',pl:'Agencja surf travel premium w Maroku. 8-dniowe obozy all-inclusive, coaching surfingowy i autentyczne wakacje surfingowe.'}),
      areaServed:[
        {'@type':'Country',name:'Poland'},{'@type':'Country',name:'France'},{'@type':'Country',name:'Germany'},
        {'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'Spain'},{'@type':'Country',name:'Netherlands'},
        {'@type':'Country',name:'Italy'},{'@type':'Country',name:'Belgium'},{'@type':'Country',name:'Switzerland'}
      ],
      priceRange:'€550–€750',parentOrganization:{'@id':baseUrl+'/#org'}
    });

    // 3. LocalBusiness
    schemas.push({
      '@context':'https://schema.org','@type':'LocalBusiness','@id':baseUrl+'/#local',
      name:'SurfAgencyMorocco',image:baseUrl+'/assets/favicon.svg',
      address:{'@type':'PostalAddress',streetAddress:'ul. Wroclawska 5A',postalCode:'30-006',addressLocality:'Kraków',addressCountry:'PL'},
      geo:{'@type':'GeoCoordinates',latitude:50.04023,longitude:19.96247},
      telephone:'+48662763381',email:'info@surfagencymorocco.com',
      openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'09:00',closes:'18:00'},
      sameAs:['https://www.instagram.com/surfagencymorocco/','https://www.facebook.com/surfagencymorocco/']
    });

    // 4. WebSite + SearchAction
    schemas.push({
      '@context':'https://schema.org','@type':'WebSite','@id':baseUrl+'/#website',
      url:baseUrl,name:'SurfAgencyMorocco',inLanguage:['pl','en','fr'],
      potentialAction:{'@type':'SearchAction',target:baseUrl+'/?q={search_term_string}','query-input':'required name=search_term_string'},
      publisher:{'@id':baseUrl+'/#org'}
    });

    // 5. WebPage
    var pageUrl = baseUrl + (lang==='pl'?'/?lang=pl':lang==='fr'?'/?lang=fr':'/');
    schemas.push({
      '@context':'https://schema.org','@type':'WebPage','@id':pageUrl+'#webpage',url:pageUrl,
      name:l10n({en:'SurfAgencyMorocco — 8-Day All-Inclusive Surf Camps Morocco',fr:'SurfAgencyMorocco — Camps de Surf Tout Inclus 8 Jours Maroc',pl:'SurfAgencyMorocco — 8-Dniowe Obozy Surfingowe All-Inclusive Maroko'}),
      description:l10n({en:'All-inclusive surf camps in Taghazout, Tamraght & Imsouane. 8 days from €550. Small groups, certified instructors, authentic Morocco.',fr:'Camps de surf tout inclus a Taghazout, Tamraght & Imsouane. 8 jours des 550€. Petits groupes, instructeurs certifies, Maroc authentique.',pl:'Obozy surfingowe all-inclusive w Taghazout, Tamraght & Imsouane. 8 dni od 550€. Male grupy, certyfikowani instruktorzy, autentyczne Maroko.'}),
      inLanguage:lang,isPartOf:{'@id':baseUrl+'/#website'},about:{'@id':baseUrl+'/#agency'},
      breadcrumb:{'@id':baseUrl+'/#breadcrumb'},speakable:{'@type':'SpeakableSpecification',cssSelector:['h1','.section-desc']}
    });

    // 6. BreadcrumbList
    schemas.push({
      '@context':'https://schema.org','@type':'BreadcrumbList','@id':baseUrl+'/#breadcrumb',
      itemListElement:[
        {'@type':'ListItem',position:1,name:l10n({en:'Home',fr:'Accueil',pl:'Strona Glówna'}),item:baseUrl+'/'},
        {'@type':'ListItem',position:2,name:l10n({en:'Surf Destinations',fr:'Destinations Surf',pl:'Destynacje Surfingowe'}),item:baseUrl+'/#destinations'},
        {'@type':'ListItem',position:3,name:l10n({en:'Surf Programs',fr:'Programmes Surf',pl:'Programy Surfingowe'}),item:baseUrl+'/#programs'},
        {'@type':'ListItem',position:4,name:l10n({en:'Book a Surf Camp',fr:'Reserver un Camp',pl:'Zarezerwuj Obóz'}),item:baseUrl+'/#booking'}
      ]
    });

    // 7. TouristDestination x3 + SportsActivityLocation
    Object.keys(dests).forEach(function(key){
      var d = dests[key];
      schemas.push({
        '@context':'https://schema.org','@type':'TouristDestination',
        name:l10n(d.name),description:l10n(d.desc),touristType:'Surfing',
        containedInPlace:{'@type':'Country',name:'Morocco'}
      });
      schemas.push({
        '@context':'https://schema.org','@type':'SportsActivityLocation',
        name:l10n(d.name)+' Surf Spot',description:l10n(d.desc),
        address:{'@type':'PostalAddress',addressLocality:l10n(d.name),addressCountry:'MA'},
        geo:{'@type':'GeoCoordinates',latitude:d.geo.lat,longitude:d.geo.lon}
      });
    });

    // 8. TouristTrip x3 (programs) + Offer
    programs.forEach(function(p){
      var t = {
        '@context':'https://schema.org','@type':'TouristTrip',
        name:l10n(p.name),description:l10n(p.desc),
        touristType:'Surfing',
        offers:{
          '@type':'Offer',name:l10n(p.name)+' — 8 Days',price:p.price+'.00',priceCurrency:'EUR',
          availability:'https://schema.org/InStock',category:'Surf Camp',
          eligibleCustomerType:'https://schema.org/individual',
          seller:{'@id':baseUrl+'/#org'}
        },
        image:baseUrl+'/'+p.image,
        provider:{'@id':baseUrl+'/#org'}
      };
      schemas.push(t);
    });

    // 9. Service
    schemas.push({
      '@context':'https://schema.org','@type':'Service',
      name:l10n({en:'8-Day All-Inclusive Surf Camp Morocco',fr:'Camp de Surf Tout Inclus 8 Jours Maroc',pl:'8-Dniowy Obóz Surfingowy All-Inclusive Maroko'}),
      description:l10n({en:'Small groups (max 8), 2 daily surf sessions, all equipment, accommodation, meals, certified instructors, video coaching, airport transfers. Taghazout, Tamraght, Imsouane.',fr:'Petits groupes (max 8), 2 sessions/jour, tout equipement, hebergement, repas, instructeurs certifies, coaching video, transferts.',pl:'Male grupy (max 8), 2 sesje dziennie, caly sprzet, zakwaterowanie, posilki, certyfikowani instruktorzy, coaching wideo, transfery.'}),
      provider:{'@id':baseUrl+'/#org'},
      areaServed:[{'@type':'Country',name:'Morocco'},{'@type':'Country',name:'Poland'},{'@type':'Country',name:'France'},{'@type':'Country',name:'Germany'},{'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'Spain'},{'@type':'Country',name:'Netherlands'},{'@type':'Country',name:'Italy'},{'@type':'Country',name:'Belgium'},{'@type':'Country',name:'Switzerland'}],
      hasOfferCatalog:{'@type':'OfferCatalog',name:l10n({en:'Surf Camp Programs',fr:'Programmes Surf',pl:'Programy Surfingowe'}),itemListElement:programs.map(function(p){return{'@type':'Offer',name:l10n(p.name),price:p.price+'.00',priceCurrency:'EUR'};})},
      offers:{'@type':'AggregateOffer',priceCurrency:'EUR',lowPrice:'550.00',highPrice:'750.00',offerCount:3,availability:'https://schema.org/InStock'}
    });

    // 10. AggregateRating
    schemas.push({
      '@context':'https://schema.org','@type':'AggregateRating',
      ratingValue:'5',bestRating:'5',worstRating:'1',ratingCount:5,
      itemReviewed:{'@id':baseUrl+'/#agency'}
    });

    // 11. Review x5
    reviews.forEach(function(r){
      schemas.push({
        '@context':'https://schema.org','@type':'Review',
        author:{'@type':'Person',name:r.name,homeLocation:{'@type':'Place',name:r.origin}},
        reviewBody:l10n(r.text),
        reviewRating:{'@type':'Rating',ratingValue:'5',bestRating:'5',worstRating:'1'},
        itemReviewed:{'@id':baseUrl+'/#agency'}
      });
    });

    // 12. ContactPoint
    schemas.push({
      '@context':'https://schema.org','@type':'ContactPoint',
      contactType:'customer service',telephone:'+48662763381',email:'info@surfagencymorocco.com',
      availableLanguage:['Polish','English','French'],
      areaServed:['PL','FR','DE','GB','ES','NL','IT','BE','CH'],
      contactOption:['TollFree','WhatsApp'],hoursAvailable:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'09:00',closes:'20:00'}
    });

    // 13. ImageObject x3
    schemas.push({'@context':'https://schema.org','@type':'ImageObject',contentUrl:baseUrl+'/images/the-magic-bay.jpg',caption:l10n({en:'Imsouane Bay — beginner-friendly surf camp waves on the Atlantic coast of Morocco',pl:'Zatoka Imsouane — fale przyjazne poczatkujacym na atlantyckim wybrzezu Maroka'}),representativeOfPage:true});
    schemas.push({'@context':'https://schema.org','@type':'ImageObject',contentUrl:baseUrl+'/images/2024-11-05.webp',caption:l10n({en:'Surf coaching at Tamraght — intermediate surf camp in Morocco',pl:'Coaching surfingowy w Tamraght — obóz sredniozaawansowany w Maroku'})});
    schemas.push({'@context':'https://schema.org','@type':'ImageObject',contentUrl:baseUrl+'/images/2024-12-10.webp',caption:l10n({en:'Taghazout advanced surf trip — world-class waves on the Atlantic coast of Morocco',pl:'Zaawansowana wyprawa surfingowa Taghazout — fale swiatowej klasy na atlantyckim wybrzezu Maroka'})});

    // 14. VideoObject
    schemas.push({
      '@context':'https://schema.org','@type':'VideoObject',
      name:l10n({en:'Surf Camp Morocco — 8-Day All-Inclusive Experience',pl:'Obóz Surfingowy Maroko — 8-Dniowe Doswiadczenie All-Inclusive'}),
      description:l10n({en:'Experience an 8-day all-inclusive surf camp on the Atlantic coast of Morocco. Taghazout, Tamraght & Imsouane.',pl:'Doswiadcz 8-dniowego obozu surfingowego all-inclusive na atlantyckim wybrzezu Maroka. Taghazout, Tamraght i Imsouane.'}),
      thumbnailUrl:'https://img.youtube.com/vi/BUzkCs2B9OY/maxresdefault.jpg',
      contentUrl:'https://www.youtube.com/watch?v=BUzkCs2B9OY',
      embedUrl:'https://www.youtube.com/embed/BUzkCs2B9OY',
      uploadDate:'2024-01-01',duration:'PT3M'
    });

    // 15. FAQPage
    schemas.push({
      '@context':'https://schema.org','@type':'FAQPage',
      mainEntity:faqs.map(function(f){
        return {'@type':'Question',name:l10n(f.q),acceptedAnswer:{'@type':'Answer',text:l10n(f.a)}};
      })
    });

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemas, null, 0);
    document.head.appendChild(script);

    // Also update <html lang> dynamically for crawlers
    if (window.i18n && window.i18n.currentLang) {
      document.documentElement.lang = window.i18n.currentLang;
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', build);
    } else {
      build();
    }
  }

  init();
})();
