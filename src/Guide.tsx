import { useEffect, useState } from "react";
import Shell from "./Shell";
import { content, type Locale } from "./content";
import type { GuideText } from "./guide/links";
import en from "./guide/en";
import zhCN from "./guide/zh-CN";
import zhTW from "./guide/zh-TW";

const guides: Record<Locale, GuideText> = { en, "zh-CN": zhCN, "zh-TW": zhTW };

export default function Guide({ locale }: { locale: Locale }) {
  const c = content[locale];
  const g = guides[locale];
  // The contents mark the section being read: the last whose heading has passed the top third.
  const [current, setCurrent] = useState<string>();
  useEffect(() => {
    const sections = g.sections.map((s) => document.getElementById(s.id)!);
    const onScroll = () => {
      const passed = sections.filter((s) => s.getBoundingClientRect().top < innerHeight / 3);
      setCurrent(passed[passed.length - 1]?.id);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [g]);
  const contents = (
    <ol>
      {g.sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} aria-current={s.id === current ? "location" : undefined}>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <Shell locale={locale} page="guide">
      <section className="page-head guide-head">
        <div className="page-head-inner">
          <h1>{c.guideTitle}</h1>
          <p className="tagline">{g.intro}</p>
        </div>
      </section>
      <div className="guide">
        {/* A sidebar beside the text on a wide screen; above it, folded, on a narrow one. */}
        <nav className="toc" aria-label={c.guideContents}>
          <h2>{c.guideContents}</h2>
          {contents}
        </nav>
        <details className="toc-folded">
          <summary>{c.guideContents}</summary>
          <nav aria-label={c.guideContents}>{contents}</nav>
        </details>
        <main className="guide-body">
          {g.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="section">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </main>
      </div>
    </Shell>
  );
}
