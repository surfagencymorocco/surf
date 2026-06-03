(function() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var closeMenu = document.getElementById('closeMenu');
  hamburger.addEventListener('click', function() { mobileMenu.classList.add('open'); });
  closeMenu.addEventListener('click', function() { mobileMenu.classList.remove('open'); });
  document.querySelectorAll('.mob-link').forEach(function(link) {
    link.addEventListener('click', function() { mobileMenu.classList.remove('open'); });
  });
})();
