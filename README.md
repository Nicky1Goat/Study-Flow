# 🥪 Sangaweech — Website

The marketing website for **Sangaweech**, the Italian sandwich shop on Lygon
Street, Carlton (Melbourne) from Sooshi Mango. Fast, mobile-first, and built to
convert Instagram followers into orders, catering enquiries and an owned email
list.

> **Making Lygon Italian again.**

Built with **[Astro](https://astro.build)** + **[Tailwind CSS v4](https://tailwindcss.com)**.
Static output (no server), tuned for Lighthouse 95+ across performance, SEO and
accessibility.

---

## ⚡ Quick start

```bash
npm install        # install dependencies
npm run dev        # local dev server → http://localhost:4321
npm run build      # production build → ./dist
npm run preview    # preview the production build locally
```

Requires **Node 20+** (Node 22 recommended).

---

## 🗂 Project structure

```
├── astro.config.mjs        # site URL, sitemap, Tailwind Vite plugin
├── .env.example            # copy to .env and fill in real values
├── netlify.toml            # Netlify build + Forms + headers
├── vercel.json             # Vercel build + headers
├── public/
│   ├── favicon.svg         # ⚠ placeholder — swap for real brand mark
│   ├── og-image.jpg        # social share image (regenerate from og-image.svg)
│   ├── og-image.svg        # editable OG image source (1200×630)
│   ├── robots.txt
│   └── images/             # drop real photos here (see images/README.md)
└── src/
    ├── data/               # ← EDIT CONTENT HERE
    │   ├── site.ts         # address, hours, phone, socials, menu PDF, order URL
    │   ├── menu.ts         # the full menu (structured data)
    │   └── reviews.ts      # review pull-quotes
    ├── styles/global.css   # design system (brand palette, fonts, components)
    ├── layouts/BaseLayout.astro   # <head>, SEO, OG, JSON-LD schema
    ├── components/         # Header, Hero, Menu, Catering, Footer, etc.
    └── pages/
        ├── index.astro     # the single-page scroll (home)
        ├── menu.astro      # /menu standalone page
        └── catering.astro  # /catering standalone page
```

---

## ✍️ Where to swap copy & images

| I want to change…            | Edit…                                            |
|------------------------------|--------------------------------------------------|
| Address / hours / phone      | `src/data/site.ts`                               |
| Socials / Instagram handle   | `src/data/site.ts` → `socials`                   |
| The menu (items/prices)      | `src/data/menu.ts`                               |
| Review quotes                | `src/data/reviews.ts`                            |
| Brand colours                | `src/styles/global.css` → `@theme` tokens        |
| Fonts                        | `BaseLayout.astro` (Google Fonts) + `global.css` |
| Story / vibe wording         | `src/components/Story.astro`, `Gallery.astro`    |
| **Photos**                   | See **`public/images/README.md`**                |

**Images:** every photo is a labelled dashed placeholder
(`src/components/ImageSlot.astro`). Drop a file in `public/images/` and set the
`src` prop on the relevant `<ImageSlot>`. Search the code for `TODO: swap` to
find them all.

**Brand colours:** the whole site reads from the `@theme` tokens at the top of
`src/styles/global.css`. Replace the hex values with colours sampled from the
real logo and everything updates.

---

## 🔌 Connecting forms & ordering (all via `.env`)

Copy `.env.example` → `.env` and fill in values. Nothing is hard-coded.

### 1. Ordering / "Skip the Queue"

Set **`PUBLIC_ORDER_URL`** to your provider's ordering link (Square Online,
me&u, Mr Yum, Order-with-Google…). Every "Order / Skip the Queue" button (header,
hero, mobile bar) switches to it automatically. Leave blank → the Order section
shows a tidy "coming soon" state.

### 2. Catering enquiry form (priority)

Choose a handler with **`PUBLIC_FORM_PROVIDER`**:

- **`netlify`** (default): Works out of the box on Netlify — the form has
  `data-netlify="true"` and Netlify detects it at deploy. Set the notification
  email under **Netlify → Forms → Settings**. *(Netlify only — not Vercel/CF.)*
- **`formspree`**: Works on **any** host. Set `PUBLIC_FORM_PROVIDER="formspree"`
  and `PUBLIC_FORMSPREE_ID="xxxxxxx"` (your Formspree form ID). Enquiries are
  emailed by Formspree.

> On Vercel or Cloudflare Pages, use **Formspree** (they have no built-in forms).

### 3. Email / SMS signup ("Stay in the loop")

Set **`PUBLIC_NEWSLETTER_ACTION`** to your list provider's hosted form action
URL and **`PUBLIC_NEWSLETTER_PROVIDER`** to `mailchimp` | `klaviyo` |
`convertkit`. Field names auto-adjust (`EMAIL`/`PHONE` for Mailchimp, `email`/
`phone` otherwise). Until set, the signup is disabled with a visible notice.

- **Mailchimp:** Audience → Signup forms → Embedded form → copy the `<form action="…">` URL.
- **Klaviyo / ConvertKit:** use the hosted form action URL from your list settings.

---

## 🚀 Deploy (one-click-ish)

The build output is a plain static site in `dist/` — it deploys anywhere.

### Netlify (recommended — gives you Forms for free)
1. Push this repo to GitHub.
2. Netlify → **Add new site → Import from Git** → pick the repo.
3. Build settings auto-fill from `netlify.toml` (`npm run build` → `dist`).
4. Add your env vars under **Site settings → Environment variables**.
5. Deploy. Set the Forms notification email under **Forms → Settings**.

_CLI alternative:_ `npx netlify-cli deploy --build --prod`

### Vercel
1. Vercel → **Add New → Project** → import the repo.
2. Framework preset **Astro** is detected (`vercel.json` sets the rest).
3. Add env vars under **Settings → Environment Variables**.
4. Deploy. *(Use Formspree for the catering form here.)*

_CLI alternative:_ `npx vercel --prod`

### Cloudflare Pages
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Build command `npm run build`, output directory `dist`.
3. Set **Node version 22** and add env vars in the Pages project settings.
4. Deploy. *(Use Formspree for the catering form here.)*

_CLI alternative:_ `npx wrangler pages deploy dist`

After deploying, set the real domain in **`SITE_URL`** (env var or
`astro.config.mjs`) so canonical URLs, the sitemap and OG tags are correct, and
update the `Sitemap:` line in `public/robots.txt`.

---

## 🔎 SEO built in

- `Restaurant` + `Menu` **JSON-LD** schema (address, geo, hours, cuisine, price
  range, socials, per-item offers) in `BaseLayout.astro`.
- Per-page `<title>`, meta description, canonical, **Open Graph** + **Twitter**
  cards.
- `sitemap-index.xml` auto-generated at build; `robots.txt` in `public/`.
- Semantic HTML, skip link, focus states, alt text, reduced-motion support.

---

## ✅ Before you go live

See **[`HANDOVER.md`](./HANDOVER.md)** — a checklist of every unverified detail
(address, hours, phone, ordering link, form destinations, real images, logo,
favicon, OG image) you need to confirm or supply.
