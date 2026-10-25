import { SITE_URL } from "../site.config.mjs";
import { content, locales, type Locale } from "./content";

const TITLE = "zDesk";

function url(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

// Each locale names itself as canonical and lists every locale as an alternate.
export function localeMeta(locale: Locale) {
  const { description } = content[locale];
  const self = url(locales.find((l) => l.id === locale)!.path);
  return [
    { title: TITLE },
    { name: "description", content: description },
    { property: "og:site_name", content: TITLE },
    { property: "og:type", content: "website" },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: description },
    { property: "og:url", content: self },
    { tagName: "link", rel: "canonical", href: self },
    ...locales.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l.id, href: url(l.path) })),
  ];
}
