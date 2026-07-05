# ✅ Sangaweech — Go-Live Handover Checklist

Everything below is a **placeholder or unverified detail** that must be confirmed
or supplied before the site goes live. Each item says exactly where to change it.
Search the codebase for `TODO` to jump to any of these in context.

---

## 🔴 Must confirm (factual details)

- [ ] **Street address / number** — sources vary between **300** and **380
      Lygon St**. Confirm and set in `src/data/site.ts` → `address`.
      _(Appears in: hero locator, Visit section, footer, JSON-LD schema, OG image.)_
- [ ] **Trading hours** — currently **placeholder hours**. Set the real hours in
      `src/data/site.ts` → `hours`. _(Shown in Visit + footer + schema. Remove the
      "placeholder" warning labels in `Visit.astro` and `Footer.astro` once done.)_
- [ ] **Phone number** — blank by default (click-to-call is hidden while empty).
      Add it in `src/data/site.ts` → `phone` (e.g. `"+61 3 9000 0000"`) to enable
      the Call buttons in the Visit section and mobile sticky bar.
- [ ] **Email addresses** — general enquiries (`site.ts` → `email`) and catering
      destination (`CATERING_EMAIL` in `.env`).
- [ ] **Map pin** — currently uses an address search query. Once the Google
      Business Profile is verified, swap `mapEmbedQuery` / geo coords in `site.ts`.
- [ ] **Socials** — Instagram is set (`@sangaweech`). Confirm/replace the
      **TikTok** and **Facebook** URLs in `site.ts` → `socials`.

---

## 🖼 Must supply (brand assets)

- [ ] **Logo** — replace the text wordmark in `Header.astro` and `Footer.astro`
      with the real logo (SVG/PNG in `/public`).
- [ ] **Photos** — every image is a labelled placeholder. Drop real photos into
      `public/images/` and set the `src` on each `<ImageSlot>`. See
      `public/images/README.md`. Slots: hero (shopfront/sandwich), story
      (interior/bread/team), gallery (laminex, tiles, lace curtains, food, chips).
- [ ] **Favicon** — replace `public/favicon.svg` with the real mark and add
      `public/apple-touch-icon.png` (referenced in `BaseLayout.astro`).
- [ ] **Social share image** — `public/og-image.jpg` is auto-generated from
      `public/og-image.svg` using placeholder fonts. Re-export a branded 1200×630
      JPG (ideally with a real photo) so link previews look great.
- [ ] **Menu PDF** — drop the real downloadable menu at the path in
      `site.ts` → `menuPdf` (default `/sangaweech-menu.pdf`), or point it at an
      external URL. Also sanity-check the on-page menu in `src/data/menu.ts`.
- [ ] **Brand colours** — the palette is a best-guess. If you have the real logo,
      sample its exact colours and replace the `@theme` tokens in
      `src/styles/global.css`.

---

## 🔌 Must connect (integrations — all via `.env`)

- [ ] **Production domain** — set `SITE_URL` (env var or `astro.config.mjs`) and
      update the `Sitemap:` line in `public/robots.txt`. Drives canonical URLs,
      sitemap and absolute OG image URL.
- [ ] **Online ordering** — set `PUBLIC_ORDER_URL` to your provider link
      (Square Online / me&u / Mr Yum / Order-with-Google). All "Skip the Queue"
      buttons switch over automatically; the Order section drops its "coming soon".
- [ ] **Catering form handler** — pick `PUBLIC_FORM_PROVIDER`:
      `netlify` (Netlify only, set notify email in dashboard) **or** `formspree`
      (`PUBLIC_FORMSPREE_ID`, works anywhere). See README → "Connecting forms".
- [ ] **Newsletter signup** — set `PUBLIC_NEWSLETTER_ACTION` +
      `PUBLIC_NEWSLETTER_PROVIDER` (Mailchimp / Klaviyo / ConvertKit). The signup
      stays disabled with a visible notice until this is set.
- [ ] **Analytics (optional)** — wire Plausible/Fathom/GA4 in `BaseLayout.astro`
      (`PUBLIC_ANALYTICS_DOMAIN` slot provided).

---

## 🧪 Pre-launch smoke test

- [ ] `npm run build` succeeds with no warnings.
- [ ] Submit the **catering form** end-to-end → confirm the email arrives.
- [ ] Submit the **newsletter** → confirm the contact lands in your list.
- [ ] Click every **"Skip the Queue"** button → lands on the real order page.
- [ ] **Directions** + **Call** buttons work on a real phone.
- [ ] Run **Lighthouse** (mobile) — target 95+ on Performance/SEO/Accessibility.
- [ ] Validate the **JSON-LD** with Google's Rich Results Test.
- [ ] Preview the **link card** (paste the URL into a DM / Slack) → OG image shows.
- [ ] Remove the placeholder **"confirm hours"** warning labels once hours are real.

---

_Once every box is ticked, you're ready to go live. Buon appetito. 🇮🇹_
