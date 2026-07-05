// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// TODO: Set this to the real production domain before going live.
// It's used for canonical URLs, sitemap.xml, and Open Graph absolute URLs.
const SITE_URL = process.env.SITE_URL || "https://sangaweech.com.au";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Static output — no server needed, deploys anywhere (Netlify/Vercel/CF Pages).
  output: "static",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Inline small stylesheets to cut render-blocking requests (Lighthouse perf).
    inlineStylesheets: "auto",
  },
});
