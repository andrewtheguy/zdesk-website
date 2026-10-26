import { useEffect, useRef, type ReactNode } from "react";
import { content, locales, pagePath, type Locale, type Page } from "./content";

const PAGES: Page[] = ["home", "demo"];

// A disclosure of plain links, each language named in itself, so it works
// before hydration; once hydrated, Escape or a tap outside closes it.
function LanguageMenu({ locale, page, label }: { locale: Locale; page: Page; label: (current: string) => string }) {
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

export default function Shell({ locale, page, children }: { locale: Locale; page: Page; children: ReactNode }) {
  const c = content[locale];
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href={pagePath(locale, "home")}>
            <img src="/logo.svg" alt="" width="28" height="28" />
            zDesk
          </a>
          <nav className="pages">
            {PAGES.map((p) => (
              <a key={p} href={pagePath(locale, p)} aria-current={p === page ? "page" : undefined}>
                {c.nav[p]}
              </a>
            ))}
          </nav>
          <LanguageMenu locale={locale} page={page} label={c.language} />
        </div>
      </header>
      {children}
      <footer>
        <p>{c.footer}</p>
      </footer>
    </>
  );
}
