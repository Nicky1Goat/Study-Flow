# Nicky's High Pressure Cleaning

A modern, light, animated single-page website for a high-pressure cleaning business.
Built as a plain static site — no build step, no dependencies.

## Files
- `index.html` — all page content (Home, Services, Pricing, Why Us, Booking, Footer)
- `styles.css` — styling, layout and animations
- `script.js` — nav, scroll reveals, stat counters, and booking form submission

## Run locally
Just open `index.html` in a browser. Or serve it:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy (free)
Drag the folder into [Netlify Drop](https://app.netlify.com/drop), or push to a
GitHub repo and enable GitHub Pages. No configuration needed.

## Things to update before going live
1. **Contact details** — search `index.html` for `[Your phone number]`,
   `[Your email]` and `[Your service area / suburb]` (and the `tel:` / `mailto:`
   links) in the footer and replace them with your real info.
2. **Booking form** — submissions are sent to Formspree endpoint
   `https://formspree.io/f/xrevaaab` (set in the `<form action="…">`). Make sure
   that form is active in your Formspree account and pointed at the right email.
3. **Pricing** — the only prices you confirmed are **Bin Cleaning $10/bin** and
   **Driveway $100**. The other service prices (patio, decking, house, fences)
   are sensible placeholders — tweak them in the Pricing section of `index.html`.

## Booking rules (as configured)
- Days: **Monday, Tuesday, Thursday**
- Times: **4:00pm – 5:00pm** (15-minute slots)
