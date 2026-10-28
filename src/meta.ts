import { SITE_URL } from "../site.config.mjs";
import { content, locales, pagePath, type Locale, type Page } from "./content";

const SITE_NAME = "zDesk";

// Each page names itself as canonical and lists its every locale as an alternate.
export function pageMeta(locale: Locale, page: Page) {
  const c = content[locale];
  const title = page === "home" ? `${SITE_NAME} · ${c.homeTitle}` : `${c.demoTitle} · ${SITE_NAME}`;
  const description = page === "home" ? c.description : c.demoDescription;
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
