/* ═══════════════════════════════════════════════════════════════════════════
   SITE CONFIG — single source of truth for business details, contact info,
   socials and SEO. Edit values here and they propagate across the whole site.
   ⚠️  Anything marked TODO must be confirmed with the owner before going live.
   ═══════════════════════════════════════════════════════════════════════════ */

export const site = {
  name: "Sangaweech",
  tagline: "Mamma's Signature Style",
  subTagline: "Eat'a Sangaweech.",
  description:
    "Sangaweech — the Italian sandwich shop on Lygon Street, Carlton from Sooshi Mango. Made-to-order filled focaccia & panini. The bread is the hero. Making Lygon Italian again.",

  // ── Location ───────────────────────────────────────────────────────────────
  // TODO: confirm exact street number — sources vary between 300 and 380 Lygon St.
  address: {
    street: "300 Lygon St",
    suburb: "Carlton",
    state: "VIC",
    postcode: "3053",
    country: "Australia",
    // Used for the "locator line" and schema.org.
    full: "300 Lygon St, Carlton VIC 3053",
  },
  // Approx geo for schema/map. TODO: fine-tune to the exact shopfront pin.
  geo: {
    lat: -37.7995,
    lng: 144.9668,
  },
  // Google Maps directions + embed. Uses the address query so it works before
  // the exact Place ID is confirmed. TODO: replace with the verified GMB place.
  mapEmbedQuery: "Sangaweech, Lygon Street, Carlton VIC",

  // ── Hours ──────────────────────────────────────────────────────────────────
  // TODO: PLACEHOLDER HOURS — confirm real trading hours with the owner.
  hours: [
    { day: "Monday", open: "Closed", close: "" },
    { day: "Tuesday", open: "11:00", close: "20:00" },
    { day: "Wednesday", open: "11:00", close: "20:00" },
    { day: "Thursday", open: "11:00", close: "20:00" },
    { day: "Friday", open: "11:00", close: "21:00" },
    { day: "Saturday", open: "10:00", close: "21:00" },
    { day: "Sunday", open: "10:00", close: "20:00" },
  ],

  // ── Contact ────────────────────────────────────────────────────────────────
  // TODO: confirm public phone number (leave blank to hide click-to-call).
  phone: "", // e.g. "+61 3 9000 0000"
  email: "hello@sangaweech.com.au", // TODO: confirm general enquiries inbox

  priceRange: "$$",
  cuisine: ["Italian", "Sandwiches", "Cafe"],

  // ── Socials (link real handles) ───────────────────────────────────────────
  socials: {
    instagram: "https://www.instagram.com/sangaweech/", // @sangaweech
    // TODO: confirm/replace with the real TikTok + Facebook handles.
    tiktok: "https://www.tiktok.com/@sooshimango",
    facebook: "https://www.facebook.com/sooshimango",
  },
  instagramHandle: "@sangaweech",
  instagramFollowers: "96K",

  // ── Menu PDF (link the shop's existing downloadable PDF) ──────────────────
  // TODO: drop the real PDF into /public/ and update this path (or external URL).
  menuPdf: "/sangaweech-menu.pdf",

  // ── Ordering ("Skip the Queue") ───────────────────────────────────────────
  // Read from env so a real provider link can be dropped in without code edits.
  orderUrl: import.meta.env.PUBLIC_ORDER_URL || "",
} as const;

export type Site = typeof site;
