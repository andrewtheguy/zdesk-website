import { DemoVideo } from "./Demo";
import Shell from "./Shell";
import GuideLink from "./GuideLink";
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
            <p>{t.packages}</p>
            <ul className="links">
              <li>
                <a className="primary" href="#install">
                  {c.getStarted}
                </a>
              </li>
              <li>
                <a href="#demo">{c.seeInAction}</a>
              </li>
              <li>
                <a className="external" href={SOURCE}>
                  <svg className="github" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  {c.source.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
              </li>
            </ul>
            <p className="rolling">{t.rolling}</p>
            <GuideLink href={pagePath(locale, "wlshare-guide")} label={c.readGuide} />
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
