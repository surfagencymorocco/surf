fetch('assets/icons/sprite.svg')
  .then(function(r) { if (!r.ok) throw new Error('SVG sprite not found'); return r.text(); })
  .then(function(svg) {
    document.body.insertAdjacentHTML('afterbegin', svg);
  })
  .catch(function() { /* sprite SVG unavailable — icons will be hidden, not critical */ });
