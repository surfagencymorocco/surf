(function() {
  function loadPrograms() {
    if (!window._supabase) {
      setTimeout(loadPrograms, 300);
      return;
    }
    SupabaseAPI.getPrograms().then(function(r) {
      if (r.error || !r.data || r.data.length === 0) return;
      var grid = document.querySelector('#programs .programs-grid');
      if (!grid) return;

      var html = '';
      var delay = 1;
      r.data.forEach(function(p) {
        var lc = (p.level || '').toLowerCase();
        var levelClass = 'beginner', dotColor = '#4ade80', levelLabel = 'Beginner Camp', bookLabel = 'Book This Camp';
        if (lc === 'intermediate') { levelClass = 'intermediate'; dotColor = '#60a5fa'; levelLabel = 'Intermediate Camp'; }
        if (lc === 'advanced') { levelClass = 'advanced'; dotColor = '#f87171'; levelLabel = 'Advanced Surf Trip'; bookLabel = 'Book This Trip'; }

        var displayName = p.name || '';
        var nameWords = displayName.split(' ');
        var mid = Math.ceil(nameWords.length / 2);
        var displayNameHtml = nameWords.slice(0, mid).join(' ') + '<br>' + nameWords.slice(mid).join(' ');

        var imgSrc = p.image || 'images/the-magic-bay.jpg';
        var datesHtml = '';
        if (p.dates && Array.isArray(p.dates)) {
          p.dates.forEach(function(d) { datesHtml += '<span class="date-chip">' + d + '</span>'; });
        }
        var includesHtml = '';
        if (p.includes && Array.isArray(p.includes)) {
          p.includes.forEach(function(i) { includesHtml += '<li><svg class="check"><use href="#icon-check"/></svg>' + i + '</li>'; });
        }

        html += '<div class="program-card reveal reveal-delay-' + delay + '">' +
          '<div class="program-header ' + levelClass + '">' +
            '<img src="' + imgSrc.replace(/"/g,'&quot;') + '" alt="' + displayName.replace(/"/g,'&quot;') + '" loading="lazy">' +
            '<div class="program-header-overlay">' +
              '<div class="program-level">' +
                '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="' + dotColor + '"/></svg>' +
                levelLabel +
              '</div>' +
              '<div class="program-name">' + displayNameHtml + '</div>' +
              '<div class="program-location"><svg><use href="#icon-pin"/></svg>' + (p.destination || '') + '</div>' +
            '</div>' +
            '<div class="program-price-badge">' +
              '<span class="price">' + (p.price || '') + '</span>' +
              '<span class="currency">EUR / pp</span>' +
            '</div>' +
          '</div>' +
          '<div class="program-body">' +
            '<div class="program-section-label"><svg><use href="#icon-calendar"/></svg>Available Dates</div>' +
            '<div class="program-dates">' + datesHtml + '</div>' +
            '<div class="program-section-label"><svg><use href="#icon-check"/></svg>What\'s Included</div>' +
            '<ul class="program-includes">' + includesHtml + '</ul>' +
            '<div class="program-cta">' +
              '<a href="#booking" class="btn-book">' + bookLabel + ' <svg><use href="#icon-arrow"/></svg></a>' +
            '</div>' +
          '</div>' +
        '</div>';
        delay = delay >= 3 ? 1 : delay + 1;
      });

      grid.innerHTML = html;

      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
    });
  }

  loadPrograms();
})();
