// Single source of truth for the site's base URL and static routes.
// Consumed by react-router.config.ts (prerender), scripts/generate-sitemap.mjs,
// and the route modules in src/ (canonical / hreflang / OpenGraph URLs).
//
// A locale's home ends in a slash: `/zh-CN/` holds `index.html` beside
// `demo.html` and `guide.html`, so GitHub Pages serves it from the directory.

export const SITE_URL = "https://zdesk.dev";

export const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/demo", changefreq: "weekly", priority: "0.9" },
  { path: "/guide", changefreq: "weekly", priority: "0.9" },
  { path: "/zh-CN/", changefreq: "weekly", priority: "0.8" },
  { path: "/zh-CN/demo", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-CN/guide", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/", changefreq: "weekly", priority: "0.8" },
  { path: "/zh-TW/demo", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/guide", changefreq: "weekly", priority: "0.7" },
];
