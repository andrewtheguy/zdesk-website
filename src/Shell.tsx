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
        <span>{current.label}</span>
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
            <a className="external" href={c.source.href}>
              <svg className="github" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              {c.source.label}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
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
