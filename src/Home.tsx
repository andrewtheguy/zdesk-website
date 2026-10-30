import { Fragment, useEffect, useRef } from "react";
import InstallTabs from "./InstallTabs";
import Shell from "./Shell";
import { HERO_VIDEO, content, pagePath, type FeatureIcon, type Locale } from "./content";

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

// How it works: the browser, the gateway and the desktops.
const FLOW_ICONS: React.ReactNode[] = [
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 9h20M6 6.5h.01M9 6.5h.01" />
  </>,
  <>
    <rect x="3" y="3" width="18" height="7" rx="2" />
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <path d="M7 6.5h.01M7 17.5h.01" />
  </>,
  ICONS.monitor,
];

export default function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  // The prerendered hero has no controls, since iOS lays its controls over the whole clip as it
  // starts. A mouse gets them on hover once the page loads, and a touch screen when it is tapped.
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (video.current && matchMedia("(hover: hover)").matches) video.current.controls = true;
  }, []);
  return (
    <Shell
      locale={locale}
      page="home"
      footnotes={c.features.map(
        (f) =>
          f.note && (
            <p className="footnote" id={`note-${f.icon}`} key={f.icon}>
              {f.note}
            </p>
          ),
      )}
    >
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
                <a className="primary" href="#quick-start">
                  {c.getStarted}
                </a>
              </li>
              <li>
                <a href={pagePath(locale, "demo")}>{c.seeInAction}</a>
              </li>
              <li>
                <a className="external" href={c.source.href}>
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
            <p className="rolling">{c.rolling}</p>
          </div>
          <figure className="hero-video">
            <video
              ref={video}
              onClick={(e) => {
                e.currentTarget.controls = true;
              }}
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
        <ol className="flow">
          {c.flow.map((stage, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <li className="hop">
                  <svg viewBox="0 0 48 12" aria-hidden="true">
                    <path d="M6 1L1 6l5 5M1 6h46M42 1l5 5-5 5" />
                  </svg>
                  <span>{c.hops[i - 1]}</span>
                </li>
              )}
              <li className="stage">
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  {FLOW_ICONS[i]}
                </svg>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </li>
            </Fragment>
          ))}
        </ol>

        <h2 className="section" id="quick-start">{c.quickStartHeading}</h2>
        <p className="warning">{c.noCompat}</p>
        <p>{c.quickStart}</p>
        <InstallTabs notes={c.installNotes} serve={c.serve} tui={c.tui} />
        <p>{c.docs}</p>
      </main>
    </Shell>
  );
}
