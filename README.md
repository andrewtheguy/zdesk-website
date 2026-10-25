# zdesk-website

The site at [zdesk.dev](https://zdesk.dev) for [zDesk](https://github.com/andrewtheguy/zdesk),
in English, Simplified Chinese (`/zh-CN`) and Traditional Chinese (`/zh-TW`). It is a
React Router app, built with Vite and prerendered to static pages, served by GitHub
Pages.

- `src/content.tsx`: the page's text for each locale, and the demo videos.
- `public/demo/`: the demo videos.
- `site.config.mjs`: the site's URL and routes, for prerendering and the sitemap.

```bash
npm install
npm run build    # prerendered site in build/client
npm run preview  # serve build/client
```

`.github/workflows/pages.yml` builds it on every push to `main` and publishes
`build/client` to GitHub Pages.
