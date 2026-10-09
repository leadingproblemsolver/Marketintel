# Zynro LLC landing page

Static, dependency-free landing page for two offers: a $149 Custom Workflow Reliability Audit (inquiries/booking open, payment off) and a $17 n8n Reliability Kit (waitlist only).

```
site/        deployable static site (publish directory)
tests/       node:test checks (links, claims, form, analytics, payment-off)
prototype/   n8n Gate 1 offline scanner. NOT verified against a live n8n instance
netlify.toml publish dir, security headers/CSP
```

## Run / test
```
npm run serve   # http://localhost:8080
npm test        # 10 site tests + 6 synthetic prototype tests
```

## Deploy (Netlify recommended: lead form works with no backend code)
Import the repo in Netlify; `netlify.toml` sets `site/` as the publish dir. Netlify detects the `data-netlify` forms (`audit-inquiry`, `kit-waitlist`) at deploy and stores submissions. On other hosts, set `leadEndpoint` in `site/site.config.js` to a form backend that accepts a urlencoded POST. Without one, the form shows an honest failure message and `lead_submit` does not fire.

## Configuration (`site/site.config.js`, public, no secrets)
- `bookingUrl`: Calendly 30-minute link (real, owned by the account holder). Empty hides the booking CTA.
- `analyticsEndpoint`: optional first-party collector (sendBeacon). Events always go to `window.dataLayer`.
- `auditCheckoutUrl` / `kitCheckoutUrl`: **empty = payments off.** Setting one reveals the checkout button and fires `checkout_start` on click.

## Analytics
`page_view`, `CTA_click`, `lead_submit` (after confirmed receipt, no PII), `checkout_start` are wired. `purchase` is defined in `analytics.js` but intentionally never fired client-side: it must be sent from a verified payment confirmation once a merchant is connected.

## Before enabling payment
Audit: confirm delivery scope, timeframe, refund terms; update `terms.html`; then set a checkout URL. Kit: complete the Gate 1 checklist (`prototype/n8n_reliability_gate1/PRODUCTION_CHECKLIST.md`) and publish its terms first.
