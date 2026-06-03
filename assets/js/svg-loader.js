fetch('assets/icons/sprite.svg')
  .then(function(r) { return r.text(); })
  .then(function(svg) {
    document.body.insertAdjacentHTML('afterbegin', svg);
  });
