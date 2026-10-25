// Single source of truth for the site's base URL and static routes.
// Consumed by react-router.config.ts (prerender), scripts/generate-sitemap.mjs,
// and the route modules in src/ (canonical / hreflang / OpenGraph URLs).

export const SITE_URL = "https://zdesk.dev";

export const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/zh-CN", changefreq: "weekly", priority: "0.8" },
  { path: "/zh-TW", changefreq: "weekly", priority: "0.8" },
];
