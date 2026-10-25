// Flattens prerendered `<route>/index.html` files into sibling `<route>.html`
// files so Cloudflare Pages serves clean URLs WITHOUT a trailing slash.
//
// Cloudflare Pages derives trailing-slash canonicalization from the asset
// layout: `about/index.html` makes `/about` redirect to `/about/`, while
// `about.html` makes `/about/` redirect to `/about`. We prerender the latter
// shape here to match the canonical/og:url/sitemap URLs (no trailing slash).
//
// Run as part of `npm run build` (after `react-router build`).

import { readdir, rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const CLIENT_DIR = fileURLToPath(new URL("../build/client", import.meta.url));

async function flatten(dir, relative = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const childDir = join(dir, entry.name);
    const childRel = relative ? `${relative}/${entry.name}` : entry.name;

    // Recurse first so nested routes (e.g. /a/b) are handled too.
    await flatten(childDir, childRel);

    const indexFiles = await readdir(childDir);
    // Only flatten directories whose sole purpose is to hold an index.html.
    if (indexFiles.length === 1 && indexFiles[0] === "index.html") {
      await rename(join(childDir, "index.html"), `${childDir}.html`);
      await rm(childDir, { recursive: true });
      console.log(`Flattened ${childRel}/index.html -> ${childRel}.html`);
    }
  }
}

await flatten(CLIENT_DIR);
