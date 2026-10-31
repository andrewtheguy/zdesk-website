# zdesk-website

The site at [zdesk.dev](https://zdesk.dev) for [zDesk](https://github.com/andrewtheguy/zdesk),
in English, Simplified Chinese (`/zh-CN/`) and Traditional Chinese (`/zh-TW/`), each
with a home page, a demo page (`/demo`, `/zh-CN/demo`, `/zh-TW/demo`) and the guide to
using zDesk (`/guide`, `/zh-CN/guide`, `/zh-TW/guide`). It is a
React Router app, built with Vite and prerendered to static pages, served by GitHub
Pages.

- `src/content.tsx`: the text of the home and demo pages for each locale, and their videos.
- `src/guide/`: the guide's text, one file per locale, and the diagrams and cards it draws with.
- `public/videos/`: the home page's video and its poster, and the demo videos, each with a poster of the same name and, where it has sound, a caption file per locale.
- `site.config.mjs`: the site's URL and routes, for prerendering and the sitemap.

```bash
npm install
npm run build    # prerendered site in build/client
npm run preview  # serve build/client
```

`.github/workflows/pages.yml` builds it on every push to `main` and publishes
`build/client` to GitHub Pages.
