import InstallTabs from "./InstallTabs";
import Shell from "./Shell";
import { HERO_VIDEO, RELEASE, content, pagePath, type FeatureIcon, type Locale } from "./content";

// Strokes on a 24-unit grid, drawn in the accent colour.
const ICONS: Record<FeatureIcon, React.ReactNode> = {
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  terminal: <path d="M4 17l6-6-6-6M12 19h8" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  sharp: <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />,
  play: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4z" />
    </>
  ),
  code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
};

export default function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <Shell locale={locale} page="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              <img className="logo" src="/logo.svg" alt="" width="48" height="48" />
              zDesk
            </h1>
            <p className="tagline">{c.tagline}</p>
            <p>{c.intro}</p>
            <ul className="links">
              <li>
                <a className="primary" href={RELEASE}>
                  {c.download}
                </a>
              </li>
              <li>
                <a href={pagePath(locale, "demo")}>{c.watchDemos}</a>
              </li>
            </ul>
            <p className="rolling">{c.rolling}</p>
          </div>
          <figure className="hero-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_VIDEO.poster}
              width={HERO_VIDEO.width}
              height={HERO_VIDEO.height}
              src={HERO_VIDEO.video}
              aria-label={c.heroVideo}
            />
            <figcaption>{c.heroVideo}</figcaption>
          </figure>
        </div>
      </section>

      <main className="wide">
        <div className="features">
          {c.features.map((f) => (
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

        <h2 className="section" id="how-it-works">{c.howHeading}</h2>
        <p>{c.how}</p>
        <pre>
          <code>{c.diagram}</code>
        </pre>

        <h2 className="section" id="quick-start">{c.quickStartHeading}</h2>
        <p>{c.quickStart}</p>
        <InstallTabs notes={c.installNotes} />
        <p>{c.docs}</p>
      </main>
    </Shell>
  );
}
