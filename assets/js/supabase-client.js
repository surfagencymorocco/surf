(function() {
  var SUPABASE_URL = 'https://gfcpxdxfshopclfmnfnk.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmY3B4ZHhmc2hvcGNsZm1uZm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjIyOTcsImV4cCI6MjA5ODI5ODI5N30.nchqNdd9MItMGsW-85SjFXaRE5z0425yYOukCTjzljo';

  var me = document.currentScript;
  var basePath = me && me.src ? me.src.replace(/\/supabase-client\.js.*$/, '') : '/assets/js';
  var LOCAL_SDK = basePath + '/vendor/supabase.min.js';

  var CDN_ATTEMPTS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
    'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js',
    'https://unpkg.com/@supabase/supabase-js@2'
  ];

  window._supabaseLoadError = null;
  var SOURCES = [LOCAL_SDK].concat(CDN_ATTEMPTS);

  function tryLoadCdn(index) {
    if (index >= SOURCES.length) {
      console.error('[Supabase] All sources failed (' + SOURCES.length + ' tried). Login will not work.');
      window._supabaseLoadError = 'Could not load Supabase SDK. Check your internet connection or firewall.';
      return;
    }
    var url = SOURCES[index];
    var sourceLabel = index === 0 ? 'local' : ('CDN ' + index);
    console.log('[Supabase] Trying ' + sourceLabel + '/' + SOURCES.length + ': ' + url);
    var script = document.createElement('script');
    script.src = url;
    var settled = false;
    var timeoutId = setTimeout(function() {
      if (settled) return;
      settled = true;
      console.error('[Supabase] Timeout after 10s from: ' + url);
      script.remove();
      tryLoadCdn(index + 1);
    }, 10000);
    script.onload = function() {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      if (typeof supabase === 'undefined' || !supabase.createClient) {
        console.error('[Supabase] Source loaded but "supabase" global not found. Trying next...');
        script.remove();
        tryLoadCdn(index + 1);
        return;
      }
      console.log('[Supabase] SDK loaded successfully from ' + sourceLabel);
      window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    };
    script.onerror = function() {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      console.error('[Supabase] Failed to load from: ' + url);
      script.remove();
      tryLoadCdn(index + 1);
    };
    document.head.appendChild(script);
  }

  tryLoadCdn(0);

  window.SupabaseAPI = {
    submitReservation: function(data) {
      return window._supabase
        ? window._supabase.from('reservations').insert([data]).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getReservations: function() {
      return window._supabase
        ? window._supabase.from('reservations').select('*').order('created_at', { ascending: false }).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    updateReservation: function(id, data) {
      return window._supabase
        ? window._supabase.from('reservations').update(data).eq('id', id).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    deleteReservation: function(id) {
      return window._supabase
        ? window._supabase.from('reservations').delete().eq('id', id).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getPrograms: function() {
      return window._supabase
        ? window._supabase.from('programs').select('*').order('created_at', { ascending: true }).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    uploadImage: function(file, fileName) {
      return window._supabase
        ? window._supabase.storage.from('program-images').upload(fileName, file, { upsert: true }).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    uploadBrochure: function(file, fileName) {
      return window._supabase
        ? window._supabase.storage.from('program-images').upload('brochures/' + fileName, file, { upsert: true }).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getImageUrl: function(path) {
      return window._supabase
        ? window._supabase.storage.from('program-images').getPublicUrl(path).data.publicUrl
        : '';
    },
    getBrochureUrl: function(fileName) {
      return window._supabase
        ? window._supabase.storage.from('program-images').getPublicUrl('brochures/' + fileName).data.publicUrl
        : '';
    },
    deleteBrochure: function(path) {
      return window._supabase
        ? window._supabase.storage.from('program-images').remove([path]).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    deleteImage: function(path) {
      return window._supabase
        ? window._supabase.storage.from('program-images').remove([path]).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    addProgram: function(data) {
      return window._supabase
        ? window._supabase.from('programs').insert([data]).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    updateProgram: function(id, data) {
      return window._supabase
        ? window._supabase.from('programs').update(data).eq('id', id).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    deleteProgram: function(id) {
      return window._supabase
        ? window._supabase.from('programs').delete().eq('id', id).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    login: function(email, password) {
      return window._supabase
        ? window._supabase.auth.signInWithPassword({ email: email, password: password }).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getEmailSettings: function() {
      return window._supabase
        ? window._supabase.from('email_settings').select('*').limit(1).then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    saveEmailSettings: function(data) {
      return window._supabase
        ? window._supabase.from('email_settings').upsert(data, { onConflict: 'id' }).select().then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getEmailTemplates: function() {
      return window._supabase
        ? window._supabase.from('email_templates').select('*').order('status').then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    saveEmailTemplate: function(data) {
      return window._supabase
        ? window._supabase.from('email_templates').upsert(data, { onConflict: 'status' }).select().then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    sendEmail: function(to, subject, html, smtpConfig, telegramData) {
      if (!window._supabase) return Promise.reject(new Error('Supabase not loaded'));
      var body = { to: to, subject: subject, html: html };
      if (smtpConfig) {
        body.host = smtpConfig.smtp_host;
        body.port = smtpConfig.smtp_port;
        body.user = smtpConfig.smtp_user;
        body.pass = smtpConfig.smtp_pass;
        body.from = smtpConfig.from_email;
      }
      if (telegramData) {
        body.telegram_data = telegramData;
      }
      var url = SUPABASE_URL + '/functions/v1/send-email';
      var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY };
      return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) }).then(function(res) {
        if (!res.ok) return res.json().then(function(d) { return { error: d }; });
        return res.json();
      }).catch(function(err) {
        return { error: { message: err.message } };
      });
    },
    logout: function() {
      return window._supabase
        ? window._supabase.auth.signOut().then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    getUser: function() {
      return window._supabase
        ? window._supabase.auth.getUser().then(function(r) { return r; })
        : Promise.reject(new Error('Supabase not loaded'));
    },
    localized: function(value, lang) {
      if (!value) return '';
      if (typeof value === 'object' && !Array.isArray(value)) {
        return value[lang || 'en'] || value.en || value.fr || Object.values(value).find(function(v) { return v; }) || '';
      }
      if (Array.isArray(value)) {
        return value.map(function(item) { return window.SupabaseAPI.localized(item, lang); });
      }
      return String(value);
    }
  };
})();
