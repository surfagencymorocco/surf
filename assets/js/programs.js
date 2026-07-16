(function() {
  var _attempts = 0;
  var _MAX = 35;
  var _lastPrograms = null;
  var _observer = null;

  function renderPrograms(programs) {
    var grid = document.querySelector('#programs .programs-grid');
    if (!grid || !programs || programs.length === 0) return;

    if (_observer) _observer.disconnect();

    var i18n = window.i18n;

    var html = '';
    var delay = 1;
    programs.forEach(function(p) {
      var enLevel = p.level && p.level.en ? p.level.en.toLowerCase() : (typeof p.level === 'string' ? p.level.toLowerCase() : 'beginner');
      var levelClass = 'beginner', dotColor = '#4ade80';
      if (enLevel === 'intermediate') { levelClass = 'intermediate'; dotColor = '#60a5fa'; }
      if (enLevel === 'advanced') { levelClass = 'advanced'; dotColor = '#f87171'; }

      var displayName = i18n ? i18n.localized(p.name) : (p.name || '');
      var nameWords = displayName.split(' ');
      var mid = Math.ceil(nameWords.length / 2);
      var displayNameHtml = nameWords.slice(0, mid).join(' ') + '<br>' + nameWords.slice(mid).join(' ');

      var displayLocation = i18n ? i18n.localized(p.destination) : (p.destination || '');

      var imgSrc = p.image || 'images/the-magic-bay.jpg';

      var datesHtml = '';
      if (p.dates && Array.isArray(p.dates)) {
        p.dates.forEach(function(d) { datesHtml += '<span class="date-chip">' + d + '</span>'; });
      }

      var includesHtml = '';
      if (p.includes && Array.isArray(p.includes)) {
        p.includes.forEach(function(i) {
          var itemText = i18n ? i18n.localized(i) : i;
          includesHtml += '<li><svg class="check"><use href="#icon-check"/></svg>' + itemText + '</li>';
        });
      }

      var datesLabel = i18n ? i18n.t('programs.dates') : 'Available Dates';
      var includesLabel = i18n ? i18n.t('programs.includes') : "What's Included";
      var currencyLabel = i18n ? i18n.t('programs.card.currency') : 'EUR / pp';
      var bookLabel = i18n ? (enLevel === 'advanced' ? i18n.t('programs.bookTrip') : i18n.t('programs.bookCamp')) : (enLevel === 'advanced' ? 'Book This Trip' : 'Book This Camp');

      var levelLabels = { beginner: 'Beginner Camp', intermediate: 'Intermediate Camp', advanced: 'Advanced Surf Trip' };
      var displayLevel = i18n ? i18n.localized(p.level) : (enLevel === 'beginner' ? levelLabels.beginner : enLevel === 'intermediate' ? levelLabels.intermediate : levelLabels.advanced);

      html += '<div class="program-card reveal reveal-delay-' + delay + '">' +
        '<div class="program-header ' + levelClass + '">' +
          '<img src="' + imgSrc.replace(/"/g,'&quot;') + '" alt="' + displayName.replace(/"/g,'&quot;') + '" loading="lazy">' +
          '<div class="program-header-overlay">' +
            '<div class="program-level">' +
              '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="' + dotColor + '"/></svg>' +
              displayLevel +
            '</div>' +
            '<div class="program-name">' + displayNameHtml + '</div>' +
            '<div class="program-location"><svg><use href="#icon-pin"/></svg>' + displayLocation + '</div>' +
          '</div>' +
          '<div class="program-price-badge">' +
            '<span class="price">' + (p.price || '') + '</span>' +
            '<span class="currency">' + currencyLabel + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="program-body">' +
          '<div class="program-section-label"><svg><use href="#icon-calendar"/></svg>' + datesLabel + '</div>' +
          '<div class="program-dates">' + datesHtml + '</div>' +
          '<div class="program-section-label"><svg><use href="#icon-check"/></svg>' + includesLabel + '</div>' +
          '<ul class="program-includes">' + includesHtml + '</ul>' +
          '<div class="program-cta">' +
            '<a href="#booking" class="btn-book">' + bookLabel + ' <svg><use href="#icon-arrow"/></svg></a>' +
            (function() {
              var currentLang = (window.i18n && window.i18n.currentLang) || 'en';
              var brochureUrl = null;
              if (currentLang === 'fr') brochureUrl = p.brochure_fr;
              else if (currentLang === 'pl') brochureUrl = p.brochure_pl;
              else brochureUrl = p.brochure_en;
              if (!brochureUrl) return '';
              var brochureLabel = i18n ? i18n.t('programs.downloadBrochure') : 'Download Brochure';
              return '<a href="' + brochureUrl.replace(/"/g,'&quot;') + '" target="_blank" rel="noopener noreferrer" class="btn-brochure">' + brochureLabel + ' <svg><use href="#icon-arrow"/></svg></a>';
            })() +
          '</div>' +
        '</div>' +
      '</div>';
      delay = delay >= 3 ? 1 : delay + 1;
    });

    grid.innerHTML = html;

    _observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(function(el) { _observer.observe(el); });
  }

  function fetchAndRender() {
    SupabaseAPI.getPrograms().then(function(r) {
      if (r.error || !r.data || r.data.length === 0) return;
      _lastPrograms = r.data;
      renderPrograms(r.data);
    });
  }

  function onI18nReady() {
    if (window._supabase) { fetchAndRender(); return; }
    waitForSupabase();
  }

  function waitForSupabase() {
    _attempts++;
    if (window._supabaseLoadError) {
      console.error('[Programs] Supabase SDK load error. Using static HTML fallback.');
      return;
    }
    if (_attempts >= _MAX) {
      console.error('[Programs] Timeout: Supabase SDK not loaded. Using static HTML fallback.');
      return;
    }
    if (!window._supabase) {
      setTimeout(waitForSupabase, 300);
      return;
    }
    fetchAndRender();
  }

  // i18n already ready? → start immediately. Otherwise → wait for event.
  if (window._i18next) {
    onI18nReady();
  } else {
    window.addEventListener('i18n:ready', onI18nReady, { once: true });
  }

  window.addEventListener('i18n:languageChanged', function() {
    if (_lastPrograms) renderPrograms(_lastPrograms);
  });
})();
