(function() {
  var submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;
  var originalHtml = submitBtn.innerHTML;

  submitBtn.addEventListener('click', function() {
    var name = document.getElementById('formName').value.trim();
    var email = document.getElementById('formEmail').value.trim();
    var phone = document.getElementById('formPhone').value.trim();
    var level = document.getElementById('formLevel').value;
    var destination = document.getElementById('formDestination').value;
    var date = document.getElementById('formDate').value;
    var message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !phone || !level || !destination || !date) {
      return;
    }

    this.innerHTML = window.i18n ? window.i18n.t('booking.form.sending') : 'Sending...';
    this.disabled = true;

    var data = {
      full_name: name,
      email: email,
      phone: phone,
      surf_level: level,
      destination: destination,
      preferred_date: date,
      message: message,
      status: 'pending'
    };

    if (window.SupabaseAPI) {
      SupabaseAPI.submitReservation(data).then(function(result) {
        if (result.error) {
          submitBtn.innerHTML = window.i18n ? window.i18n.t('booking.form.error') : 'Error — try again';
          submitBtn.disabled = false;
          setTimeout(function() {
            submitBtn.innerHTML = originalHtml;
          }, 3000);
        } else {
          var successMsg = window.i18n ? window.i18n.t('booking.form.success') : "Request Sent! We'll reply in 24h";
          submitBtn.innerHTML = '<svg><use href="#icon-check"/></svg> ' + successMsg;
          submitBtn.style.background = '#1a7a4a';
          document.getElementById('formName').value = '';
          document.getElementById('formEmail').value = '';
          document.getElementById('formPhone').value = '';
          document.getElementById('formLevel').value = '';
          document.getElementById('formDestination').value = '';
          document.getElementById('formDate').value = '';
          document.getElementById('formMessage').value = '';
          setTimeout(function() {
            submitBtn.innerHTML = originalHtml;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 4000);
          var inserted = result.data && result.data[0] ? result.data[0] : {};
          var reservationInfo = {
            id: inserted.id || null,
            created_at: inserted.created_at || null,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            surf_level: data.surf_level,
            destination: data.destination,
            preferred_date: data.preferred_date,
            message: data.message
          };
          // Telegram notification — independent, fires regardless of email config
          SupabaseAPI.notifyTelegram(reservationInfo).then(function() {});
          // Customer email — requires SMTP + pending template
          SupabaseAPI.getEmailSettings().then(function(sr) {
            if (sr.error || !sr.data || !sr.data[0] || !sr.data[0].smtp_user) return;
            var smtp = sr.data[0];
            SupabaseAPI.getEmailTemplates().then(function(tr) {
              if (tr.error || !tr.data) return;
              var tmpl = null;
              tr.data.forEach(function(t) { if (t.status === 'pending') tmpl = t; });
              if (!tmpl || !tmpl.subject || !tmpl.body_html) return;
              var subject = SupabaseAPI.localized ? SupabaseAPI.localized(tmpl.subject) : tmpl.subject;
              var bodyHtml = SupabaseAPI.localized ? SupabaseAPI.localized(tmpl.body_html) : tmpl.body_html;
              var html = bodyHtml
                .replace(/\{\{name\}\}/g, data.full_name)
                .replace(/\{\{destination\}\}/g, data.destination)
                .replace(/\{\{date\}\}/g, data.preferred_date)
                .replace(/\{\{status\}\}/g, 'pending');
              SupabaseAPI.sendEmail(data.email, subject, html, smtp).then(function() {});
            });
          });
        }
      });
    } else {
      // Fallback mock
      var fallbackMsg = window.i18n ? window.i18n.t('booking.form.success') : "Request Sent! We'll reply in 24h";
      this.innerHTML = '<svg><use href="#icon-check"/></svg> ' + fallbackMsg;
      this.style.background = '#1a7a4a';
      setTimeout(function() {
        submitBtn.innerHTML = originalHtml;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  });
})();
