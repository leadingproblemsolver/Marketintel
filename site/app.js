(function () {
  "use strict";
  var cfg = window.ZYNRO_CONFIG || {};
  var A = window.ZynroAnalytics;
  A.track("page_view", { title: document.title });

  // Booking / checkout links driven by config
  document.querySelectorAll("[data-booking]").forEach(function (el) {
    if (cfg.bookingUrl) { el.href = cfg.bookingUrl; el.rel = "noopener"; el.target = "_blank"; } else { el.hidden = true; }
  });
  document.querySelectorAll("[data-checkout]").forEach(function (el) {
    var url = cfg[el.dataset.checkout + "CheckoutUrl"];
    if (url) { el.href = url; el.hidden = false; } else { el.hidden = true; }
  });
  document.querySelectorAll("[data-pay-pending]").forEach(function (el) {
    el.hidden = !!cfg[el.dataset.payPending + "CheckoutUrl"];
  });

  // CTA click tracking (checkout_start for configured checkout links)
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (!el) return;
    var props = { cta: el.dataset.cta, offer: el.dataset.offer || "" };
    A.track("CTA_click", props);
    if (el.hasAttribute("data-checkout") && el.href) A.track("checkout_start", { offer: el.dataset.offer || "" });
  });

  // Lead forms
  document.querySelectorAll("form[data-lead]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    function say(msg, ok) { status.textContent = msg; status.className = "form-status " + (ok ? "ok" : "err"); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="bot-field"]').value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true; say("Sending…", true);
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch(cfg.leadEndpoint || "/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          A.track("lead_submit", { offer: form.dataset.lead }); // only after confirmed receipt; no PII in event
          form.reset();
          say(form.dataset.lead === "kit" ? "Thanks. You are on the waitlist. No payment has been taken." : "Thanks. Your inquiry was received. We will reply by email. No payment has been taken.", true);
        })
        .catch(function () {
          say("We could not record your message, so nothing was sent. Please try again, or use the booking link on this page.", false);
        })
        .finally(function () { btn.disabled = false; });
    });
  });
})();
