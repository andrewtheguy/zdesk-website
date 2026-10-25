// Generates build/client/sitemap.xml from the shared route list.
// Run as part of `npm run build` (after `react-router build`).

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SITE_URL, routes } from "../site.config.mjs";

const OUT_FILE = fileURLToPath(
  new URL("../build/client/sitemap.xml", import.meta.url),
);

const urls = routes
  .map(({ path, changefreq, priority }) => {
    const loc = `${SITE_URL}${path}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(OUT_FILE, xml);
console.log(`Generated sitemap.xml with ${routes.length} URLs -> ${OUT_FILE}`);
