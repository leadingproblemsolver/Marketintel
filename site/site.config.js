/* Runtime configuration. No secrets belong here: everything in this file is public. */
window.ZYNRO_CONFIG = {
  // Real scheduling page (Calendly, 30 min). Set to "" to hide the booking CTA.
  bookingUrl: "https://calendly.com/leadingproblemsolver/30min",
  // Lead capture endpoint. "/" works on Netlify (Netlify Forms, see netlify.toml).
  // For another host set a form-backend URL that accepts a urlencoded POST.
  leadEndpoint: "/",
  // Optional collector for analytics events (POST JSON via sendBeacon). "" = disabled.
  analyticsEndpoint: "",
  // Payments stay OFF until merchant credentials and delivery readiness are confirmed.
  // Setting a URL here makes checkout CTAs appear and fires checkout_start.
  auditCheckoutUrl: "",
  kitCheckoutUrl: ""
};
