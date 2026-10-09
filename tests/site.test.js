const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const site = path.join(__dirname, "..", "site");
const read = (f) => fs.readFileSync(path.join(site, f), "utf8");
const pages = ["index.html", "privacy.html", "terms.html"];

test("all local links, scripts and anchors resolve", () => {
  for (const p of pages) {
    const html = read(p);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/(?:href|src)="([^"#][^"#]*)(#[^"]*)?"/g)) {
      if (/^(https?:|mailto:)/.test(m[1])) continue;
      assert.ok(fs.existsSync(path.join(site, m[1])), `${p}: missing ${m[1]}`);
    }
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]), `${p}: missing anchor #${m[1]}`);
  }
  const idx = read("index.html"), terms = read("terms.html");
  for (const m of idx.matchAll(/href="(terms|privacy)\.html#([^"]+)"/g)) assert.ok(terms.includes(`id="${m[2]}"`));
});

test("six failure categories present", () => {
  assert.strictEqual((read("index.html").match(/<div class="num">0[1-6]<\/div>/g) || []).length, 6);
});

test("both offers with correct prices and honest status", () => {
  const h = read("index.html");
  assert.match(h, /\$149/); assert.match(h, /\$17/);
  assert.match(h, /Coming soon/); assert.match(h, /Not for sale yet/); assert.match(h, /Payment is not open yet/);
});

test("form collects name, work email, inquiry and has no payment fields", () => {
  const h = read("index.html");
  const f = h.match(/<form name="audit-inquiry"[\s\S]*?<\/form>/)[0];
  for (const n of ["name", "email", "inquiry"]) assert.match(f, new RegExp(`name="${n}"`));
  assert.match(f, /type="email"/);
  assert.doesNotMatch(h, /card[-_ ]?number|cvc|stripe\.com|paypal\.com|checkout\.session/i);
});

test("no fabricated proof, guarantees, urgency or scarcity", () => {
  const text = pages.map(read).join(" ").replace(/<[^>]+>/g, " ");
  for (const re of [/testimonial/i, /trusted by/i, /\bguarantee(d|s)?\b(?!.*(does not|no|not))/i, /limited (time|spots|offer)/i, /only \d+ (left|spots)/i, /act now/i, /countdown/i, /money[- ]back/i, /\b\d+% (faster|reduction)/i])
    assert.doesNotMatch(text.replace(/does not (promise|claim)[^.]*\./gi, "").replace(/not a guarantee[^.]*\./gi, ""), re, String(re));
});

test("no secrets or private emails shipped", () => {
  const all = fs.readdirSync(site).filter((f) => !fs.statSync(path.join(site, f)).isDirectory()).map(read).join("\n");
  assert.doesNotMatch(all, /sk_(live|test)_|pk_(live|test)_|api[_-]?key\s*[:=]|@gmail\.com/i);
});

test("payments disabled by default in config", () => {
  const w = {}; new Function("window", read("site.config.js"))(w);
  assert.strictEqual(w.ZYNRO_CONFIG.auditCheckoutUrl, ""); assert.strictEqual(w.ZYNRO_CONFIG.kitCheckoutUrl, "");
  assert.match(w.ZYNRO_CONFIG.bookingUrl, /^https:\/\/calendly\.com\//);
});

test("analytics: allowed events only, pushes to dataLayer", () => {
  global.window = undefined;
  delete require.cache[require.resolve("../site/analytics.js")];
  const { track, EVENTS } = require("../site/analytics.js");
  assert.deepStrictEqual(EVENTS, ["page_view", "CTA_click", "lead_submit", "checkout_start", "purchase"]);
  for (const e of EVENTS) assert.strictEqual(track(e, { offer: "audit" }).event, e);
  assert.strictEqual(globalThis.dataLayer.length, 5);
  assert.throws(() => track("signup"));
});

test("app.js fires lead_submit only after a successful response", () => {
  const js = read("app.js");
  assert.ok(js.indexOf("if (!r.ok) throw") < js.indexOf('A.track("lead_submit"'));
  assert.doesNotMatch(js, /track\("purchase"/);
});

test("css cannot override the hidden attribute (payment buttons stay invisible)", () => {
  assert.match(read("style.css"), /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test("whop listing keeps owner-decision placeholders and invents no results", () => {
  const d = fs.readFileSync(path.join(__dirname, "..", "docs", "whop-listing.md"), "utf8");
  assert.match(d, /\*\*\[OWNER/); assert.match(d, /\$149/);
  assert.doesNotMatch(d, /testimonial|money[- ]back guarantee|limited (time|spots)/i);
});
