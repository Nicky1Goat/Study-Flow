# Image slots — where to drop the real photos

Every image on the site currently renders as a **labelled dashed placeholder**
(see `src/components/ImageSlot.astro`). To swap in a real brand photo:

1. Drop the file into this folder, e.g. `public/images/hero-shopfront.jpg`.
2. Open the component that owns the slot and set the `src` prop, e.g.
   `<ImageSlot src="/images/hero-shopfront.jpg" ... />`.
3. Keep the `alt` text meaningful (it's used for accessibility + SEO).

## Slots to fill (grep for `TODO: swap` in `src/`)

| Section  | Component            | Suggested photo                          |
|----------|----------------------|------------------------------------------|
| Hero     | `Hero.astro`         | Shopfront **or** a hero sandwich (eager)  |
| Story    | `Story.astro`        | Interior / bread-making / team            |
| Gallery  | `Gallery.astro`      | Laminex, tiles, lace curtains, food, chips|

## Image tips for performance (Lighthouse 95+)

- Export at ~1600px wide max for hero, ~800px for gallery tiles.
- Use `.webp` or well-compressed `.jpg`. Keep each file under ~250 KB.
- The `<ImageSlot>` component already sets `loading="lazy"` (except the hero,
  which is `eager`) and `decoding="async"`.

## Brand assets still needed

- **Logo**: real logo SVG/PNG to replace the text wordmark in `Header.astro`
  and `Footer.astro`.
- **Favicon**: replace `public/favicon.svg` (and add `apple-touch-icon.png`).
- **OG image**: export `public/og-image.svg` → `public/og-image.jpg` (1200×630).
