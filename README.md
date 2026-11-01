# zdesk-website

The site at [zdesk.dev](https://zdesk.dev) for [zDesk](https://github.com/andrewtheguy/zdesk),
in English, Simplified Chinese (`/zh-CN/`) and Traditional Chinese (`/zh-TW/`), each
with a home page, a demo page (`/demo`), a page for [wlshare](https://github.com/andrewtheguy/wlshare)
(`/wlshare`), and the guides (`/guides/`): using zDesk (`/guides/zdesk`) and setting up
wlshare (`/guides/wlshare`). It is a React Router app, built with Vite and prerendered
to static pages, served by GitHub Pages.

- `src/content.tsx`: the text of the home, demo and guides pages for each locale, and their videos.
- `src/guides/`: each guide's text, one file per locale under `zdesk/` and `wlshare/`, and the diagrams and cards they draw with.
- `src/wlshare/`: the wlshare page's text, one file per locale.
- `public/logo.svg`, `public/wlshare-logo.svg`: zDesk's and wlshare's logos, copies of each repository's own `logo.svg`. zDesk's is the favicon, and `public/favicon.ico` is it rendered at 16, 32 and 48 pixels for what takes no SVG icon: `for s in 16 32 48; do rsvg-convert -w $s -h $s public/logo.svg -o $s.png; done; magick 16.png 32.png 48.png public/favicon.ico`.
- `public/images/`: the stills, frames from the demo recordings' originals or captures of a session, each wider than 1600 pixels with a copy that wide beside it.
- `public/videos/`: the home page's video and its poster, the guides' soundless loops, and the demo videos, each with a poster of the same name and, where it has sound, a caption file per locale.
- `site.config.mjs`: the site's URL and routes, for prerendering and the sitemap.

```bash
npm install
npm run build    # prerendered site in build/client
npm run preview  # serve build/client
```

`.github/workflows/pages.yml` builds it on every push to `main` and publishes
`build/client` to GitHub Pages.
