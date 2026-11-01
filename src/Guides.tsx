import Shell from "./Shell";
import { content, pagePath, type Guide, type Locale } from "./content";
import { guideText } from "./guides/text";

const GUIDES: Guide[] = ["zdesk", "wlshare"];
// Each guide beside the logo of what it covers.
const LOGOS: Record<Guide, string> = { zdesk: "/logo.svg", wlshare: "/wlshare-logo.svg" };

// The guides' index: each guide with what it says, its sections linked.
export default function Guides({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <Shell locale={locale} page="guides">
      <section className="page-head">
        <div className="page-head-inner">
          <h1>{c.guidesTitle}</h1>
          <p className="tagline">{c.guidesIntro}</p>
        </div>
      </section>
      <main className="wide">
        <div className="guide-cards">
          {GUIDES.map((guide) => {
            const href = pagePath(locale, `${guide}-guide`);
            return (
              <section className="guide-card" key={guide} id={guide}>
                <h2>
                  <a href={href}>
                    <img className="logo" src={LOGOS[guide]} alt="" width="40" height="40" />
                    {c.guides[guide].title}
                  </a>
                </h2>
                <p>{c.guides[guide].description}</p>
                <h3>{c.guideContents}</h3>
                <ol>
                  {guideText[guide][locale].sections.map((s) => (
                    <li key={s.id}>
                      <a href={`${href}#${s.id}`}>{s.title}</a>
                    </li>
                  ))}
                </ol>
                <ul className="links">
                  <li>
                    <a className="primary" href={href}>
                      {c.readGuide}
                    </a>
                  </li>
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </Shell>
  );
}
