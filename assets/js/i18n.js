(function () {
  'use strict';

  var CDN_I18NEXT = 'https://unpkg.com/i18next@23/dist/esm/i18next.js';
  var CDN_DETECTOR = 'https://unpkg.com/i18next-browser-languagedetector@8/dist/esm/i18nextBrowserLanguageDetector.js';
  var STORAGE_KEY = 'i18n_lang';

  var _currentLang = 'en';
  var _resolveReady;
  window.i18nReady = new Promise(function (resolve) { _resolveReady = resolve; });

  function localized(value, lang) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && !Array.isArray(value)) {
      lang = lang || _currentLang;
      var fallbacks = [lang, 'en', 'fr'];
      for (var i = 0; i < fallbacks.length; i++) {
        if (value[fallbacks[i]]) return value[fallbacks[i]];
      }
      var keys = Object.keys(value);
      for (var j = 0; j < keys.length; j++) {
        if (value[keys[j]]) return value[keys[j]];
      }
      return '';
    }
    if (Array.isArray(value)) {
      return value.map(function (item) { return localized(item, lang); });
    }
    return String(value);
  }

  function translatePage() {
    document.documentElement.lang = _currentLang;

    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = window._i18next.t(key);
    }

    var phElements = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phElements.length; j++) {
      var pel = phElements[j];
      pel.placeholder = window._i18next.t(pel.getAttribute('data-i18n-placeholder'));
    }

    var tElements = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < tElements.length; k++) {
      var tel = tElements[k];
      tel.title = window._i18next.t(tel.getAttribute('data-i18n-title'));
    }

    var aElements = document.querySelectorAll('[data-i18n-alt]');
    for (var m = 0; m < aElements.length; m++) {
      var ael = aElements[m];
      ael.alt = window._i18next.t(ael.getAttribute('data-i18n-alt'));
    }

    var cElements = document.querySelectorAll('[data-i18n-content]');
    for (var n = 0; n < cElements.length; n++) {
      var cel = cElements[n];
      cel.content = window._i18next.t(cel.getAttribute('data-i18n-content'));
    }

    var ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    for (var q = 0; q < ariaElements.length; q++) {
      var arEl = ariaElements[q];
      arEl.setAttribute('aria-label', window._i18next.t(arEl.getAttribute('data-i18n-aria-label')));
    }

    var langBtns = document.querySelectorAll('[data-lang]');
    for (var p = 0; p < langBtns.length; p++) {
      var btn = langBtns[p];
      btn.classList.toggle('active', btn.getAttribute('data-lang') === _currentLang);
    }
  }

  function changeLanguage(lang) {
    return window._i18next.changeLanguage(lang).then(function () {
      _currentLang = lang;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
      translatePage();
    });
  }

  function t(key, options) {
    return window._i18next ? window._i18next.t(key, options) : (key || '');
  }

  window.i18n = {
    get currentLang() { return _currentLang; },
    t: t,
    localized: localized,
    translatePage: translatePage,
    changeLanguage: changeLanguage
  };

  async function init() {
    try {
      var i18nextModule = await import(CDN_I18NEXT);
      var i18next = i18nextModule.default;
      var detectorModule = await import(CDN_DETECTOR);
      var LanguageDetector = detectorModule.default;

      var configModule = await import('/locales/config.js');
      var config = configModule;
      var LANGUAGES = config.LANGUAGES;
      var DEFAULT_LANG = config.DEFAULT_LANG;
      var DETECTION_ORDER = config.DETECTION_ORDER;

      var en = (await import('/locales/en.js')).default;
      var fr = (await import('/locales/fr.js')).default;
      var pl = (await import('/locales/pl.js')).default;

      await i18next.use(LanguageDetector).init({
        resources: {
          en: { translation: en },
          fr: { translation: fr },
          pl: { translation: pl }
        },
        fallbackLng: ['en', 'fr'],
        load: 'languageOnly',
        supportedLngs: ['en', 'fr', 'pl'],
        nonExplicitSupportedLngs: true,
        detection: {
          order: DETECTION_ORDER,
          caches: ['localStorage'],
          lookupLocalStorage: STORAGE_KEY
        },
        interpolation: { escapeValue: false }
      });

      window._i18next = i18next;
      _currentLang = i18next.language.includes('-') ? i18next.language.split('-')[0] : i18next.language;
      if (!['en','fr','pl'].includes(_currentLang)) _currentLang = 'en';

      translatePage();

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-lang]');
        if (!btn) return;
        e.preventDefault();
        var lang = btn.getAttribute('data-lang');
        if (lang && lang !== _currentLang) {
          changeLanguage(lang);
        }
      });

      _resolveReady();

    } catch (err) {
      console.error('[i18n] Init failed:', err);
      _resolveReady();
    }
  }

  init();
})();
