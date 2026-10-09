/* Zynro analytics: page_view, CTA_click, lead_submit, checkout_start, purchase.
   Events go to window.dataLayer (for GTM/GA4), an optional first-party endpoint,
   and a DOM CustomEvent. No cookies, no third-party scripts. */
(function (root) {
  "use strict";
  var EVENTS = ["page_view", "CTA_click", "lead_submit", "checkout_start", "purchase"];

  function track(name, props) {
    if (EVENTS.indexOf(name) === -1) throw new Error("Unknown analytics event: " + name);
    var cfg = root.ZYNRO_CONFIG || {};
    var payload = Object.assign({ event: name, path: root.location ? root.location.pathname : "", ts: Date.now() }, props || {});
    root.dataLayer = root.dataLayer || [];
    root.dataLayer.push(payload);
    try {
      if (cfg.analyticsEndpoint && root.navigator && root.navigator.sendBeacon) {
        root.navigator.sendBeacon(cfg.analyticsEndpoint, JSON.stringify(payload));
      }
      if (root.document && root.CustomEvent) root.document.dispatchEvent(new root.CustomEvent("zynro:analytics", { detail: payload }));
    } catch (e) { /* analytics must never break the page */ }
    return payload;
  }

  // purchase is only valid after a verified payment confirmation (e.g. server webhook
  // -> success page with a signed order id). It is deliberately never called on click.
  var api = { track: track, EVENTS: EVENTS };
  root.ZynroAnalytics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
