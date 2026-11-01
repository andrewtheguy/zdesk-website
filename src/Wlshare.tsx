import { DemoVideo } from "./Demo";
import Shell from "./Shell";
import SourceLink from "./SourceLink";
import { content, demos, pagePath, type Locale } from "./content";
import ICONS from "./guides/icons";
import { wlshareText } from "./wlshare/text";

const SOURCE = "https://github.com/andrewtheguy/wlshare";
const HERO = { name: "wlshare-sway", width: 3456, height: 2234 };
// The demo recorded through wlshare, which the zDesk demo page shows too.
const DEMO = demos.find((d) => d.id === "mac-to-linux")!;

export default function Wlshare({ locale }: { locale: Locale }) {
  const c = content[locale];
  const t = wlshareText[locale];
  const src = `/images/${HERO.name}.webp`;
  return (
    <Shell locale={locale} page="wlshare">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                {ICONS.terminal}
              </svg>
              <span className="wordmark">wlshare</span>
            </h1>
            <p className="tagline">{t.tagline}</p>
            <p>{t.intro}</p>
            <ul className="links">
              <li>
                <a className="primary" href="#install">
                  {c.getStarted}
                </a>
              </li>
              <li>
                <a href={pagePath(locale, "wlshare-guide")}>{c.readGuide}</a>
              </li>
              <li>
                <a href="#demo">{c.seeInAction}</a>
              </li>
            </ul>
            <SourceLink href={SOURCE} label={c.source.label} />
          </div>
          <figure className="hero-still">
            <img
              src={src}
              srcSet={`/images/${HERO.name}-1600.webp 1600w, ${src} ${HERO.width}w`}
              sizes="(max-width: 52rem) 100vw, 38rem"
              alt=""
              width={HERO.width}
              height={HERO.height}
              fetchPriority="high"
            />
            <figcaption>{t.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      <main className="wide">
        <div className="features">
          {t.features.map((f) => (
            <section className="feature" key={f.icon}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                {ICONS[f.icon]}
              </svg>
              <div>
                <h2>{f.title}</h2>
                <p>{f.body}</p>
              </div>
            </section>
          ))}
        </div>
        <section id="demo" className="wlshare-section">
          <h2 className="section">{t.demoHeading}</h2>
          <p>{t.demoIntro}</p>
          <DemoVideo demo={DEMO} locale={locale} heading="h3" />
        </section>
        {t.sections.map((s) => (
          <section key={s.id} id={s.id} className="wlshare-section">
            <h2 className="section">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </main>
    </Shell>
  );
}
