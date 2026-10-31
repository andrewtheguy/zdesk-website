import { useEffect, useRef, type ReactNode } from "react";
import { content, locales, pagePath, type Locale, type Page } from "./content";

const PAGES: Page[] = ["home", "demo", "guide"];

// A menu is a disclosure of plain links, so it works before hydration; once hydrated, Escape or
// a tap outside closes it.
function useDismiss() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const menu = ref.current;
      if (menu?.open && !menu.contains(e.target as Node)) menu.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      const menu = ref.current;
      if (menu?.open && e.key === "Escape") {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return ref;
}

function PageLinks({ locale, page, className }: { locale: Locale; page: Page; className: string }) {
  const c = content[locale];
  return (
    <ul className={className}>
      {PAGES.map((p) => (
        <li key={p}>
          <a href={pagePath(locale, p)} aria-current={p === page ? "page" : undefined}>
            {c.nav[p]}
          </a>
        </li>
      ))}
    </ul>
  );
}

// On a phone the page links collapse into this menu, at the top bar's right.
function PageMenu({ locale, page }: { locale: Locale; page: Page }) {
  const ref = useDismiss();
  return (
    <details className="page-menu" ref={ref}>
      <summary>
        <svg className="open" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg className="close" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        {content[locale].menu}
      </summary>
      <PageLinks locale={locale} page={page} className="page-menu-links" />
    </details>
  );
}

// Each language named in itself.
function LanguageMenu({ locale, page, label }: { locale: Locale; page: Page; label: (current: string) => string }) {
  const ref = useDismiss();
  const current = locales.find((l) => l.id === locale)!;
  return (
    <details className="language" ref={ref}>
      <summary aria-label={label(current.label)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {current.short ? (
          <>
            <span className="long">{current.label}</span>
            <span className="short">{current.short}</span>
          </>
        ) : (
          <span>{current.label}</span>
        )}
        <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <ul>
        {locales.map((l) => (
          <li key={l.id}>
            <a
              href={pagePath(l.id, page)}
              lang={l.id}
              hrefLang={l.id}
              aria-current={l.id === locale ? "page" : undefined}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function Shell({
  locale,
  page,
  footnotes,
  children,
}: {
  locale: Locale;
  page: Page;
  footnotes?: ReactNode;
  children: ReactNode;
}) {
  const c = content[locale];
  return (
    <>
      <header className="topbar">
        {/* Navigation only: keep the brand, page links and language names out of search snippets. */}
        <div className="topbar-inner" data-nosnippet>
          <a className="brand" href={pagePath(locale, "home")}>
            <img src="/logo.svg" alt="" width="28" height="28" />
            <span>zDesk</span>
          </a>
          <nav className="pages">
            <PageLinks locale={locale} page={page} className="page-links" />
            <PageMenu locale={locale} page={page} />
          </nav>
          <LanguageMenu locale={locale} page={page} label={c.language} />
        </div>
      </header>
      {children}
      <footer>
        {footnotes}
        <p>{c.footer}</p>
      </footer>
    </>
  );
}
