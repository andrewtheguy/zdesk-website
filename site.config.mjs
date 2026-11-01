// Single source of truth for the site's base URL and static routes.
// Consumed by react-router.config.ts (prerender), scripts/generate-sitemap.mjs,
// and the route modules in src/ (canonical / hreflang / OpenGraph URLs).
//
// A locale's home and the guides' index end in a slash: `/zh-CN/` holds `index.html` beside
// `demo.html` and `wlshare.html`, and `/guides/` holds `index.html` beside `zdesk.html` and
// `wlshare.html`, so GitHub Pages serves each from its directory.

export const SITE_URL = "https://zdesk.dev";

export const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/demo", changefreq: "weekly", priority: "0.9" },
  { path: "/guides/", changefreq: "weekly", priority: "0.8" },
  { path: "/guides/zdesk", changefreq: "weekly", priority: "0.9" },
  { path: "/guides/wlshare", changefreq: "weekly", priority: "0.9" },
  { path: "/wlshare", changefreq: "weekly", priority: "0.9" },
  { path: "/zh-CN/", changefreq: "weekly", priority: "0.8" },
  { path: "/zh-CN/demo", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-CN/guides/", changefreq: "weekly", priority: "0.6" },
  { path: "/zh-CN/guides/zdesk", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-CN/guides/wlshare", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-CN/wlshare", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/", changefreq: "weekly", priority: "0.8" },
  { path: "/zh-TW/demo", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/guides/", changefreq: "weekly", priority: "0.6" },
  { path: "/zh-TW/guides/zdesk", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/guides/wlshare", changefreq: "weekly", priority: "0.7" },
  { path: "/zh-TW/wlshare", changefreq: "weekly", priority: "0.7" },
];
