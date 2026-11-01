import { SITE_URL } from "../site.config.mjs";
import { content, locales, pagePath, type Locale, type Page } from "./content";
import { wlshareText } from "./wlshare/text";

const SITE_NAME = "zDesk";

// The page's own title, before the site's name, and its description.
function titleAndDescription(locale: Locale, page: Page): [string, string] {
  const c = content[locale];
  switch (page) {
    case "home":
      return [c.homeTitle, c.description];
    case "demo":
      return [c.demoTitle, c.demoDescription];
    case "guides":
      return [c.guidesTitle, c.guidesDescription];
    case "zdesk-guide":
      return [c.guides.zdesk.title, c.guides.zdesk.description];
    case "wlshare-guide":
      return [c.guides.wlshare.title, c.guides.wlshare.description];
    case "wlshare":
      return [wlshareText[locale].title, wlshareText[locale].description];
  }
}

// Each page names itself as canonical and lists its every locale as an alternate.
export function pageMeta(locale: Locale, page: Page) {
  const [own, description] = titleAndDescription(locale, page);
  const title = page === "home" ? `${SITE_NAME} · ${own}` : `${own} · ${SITE_NAME}`;
  const self = `${SITE_URL}${pagePath(locale, page)}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: self },
    { tagName: "link", rel: "canonical", href: self },
    ...locales.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l.id, href: `${SITE_URL}${pagePath(l.id, page)}` })),
  ];
}
