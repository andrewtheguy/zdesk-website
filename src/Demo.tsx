import { useEffect, type CSSProperties } from "react";
import Shell from "./Shell";
import { content, demos, locales, type Demo as DemoVideo, type Locale } from "./content";

const poster = (demo: DemoVideo) => `/videos/${demo.video.replace(/\.mp4$/, ".jpg")}`;
const portrait = (demo: DemoVideo) => demo.height > demo.width;

function Length({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return <time dateTime={`PT${m}M${s}S`}>{`${m}:${String(s).padStart(2, "0")}`}</time>;
}

function Sound({ label }: { label: string }) {
  return (
    <span className="sound">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
      </svg>
      {label}
    </span>
  );
}

// Consecutive phone recordings share a row on a wide screen; every other demo has a row of its own.
function rows(list: DemoVideo[]) {
  const out: DemoVideo[][] = [];
  for (const demo of list) {
    const last = out[out.length - 1];
    if (last && portrait(demo) && last.length === 1 && portrait(last[0])) last.push(demo);
    else out.push([demo]);
  }
  return out;
}

export default function Demo({ locale }: { locale: Locale }) {
  const c = content[locale];
  const language = locales.find((l) => l.id === locale)!.label;
  // One demo plays at a time: starting one pauses whichever was playing.
  useEffect(() => {
    const onPlay = (e: Event) => {
      for (const video of document.querySelectorAll<HTMLVideoElement>(".demo video")) {
        if (video !== e.target && !video.paused) video.pause();
      }
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, []);
  return (
    <Shell locale={locale} page="demo">
      <section className="page-head">
        <div className="page-head-inner">
          <h1>{c.demoTitle}</h1>
          <p className="tagline">{c.demoIntro}</p>
        </div>
      </section>
      <main className="wide">
        <ul className="demo-index">
          {demos.map((demo) => (
            <li key={demo.id}>
              <a href={`#${demo.id}`}>
                <span className="thumb">
                  <img src={poster(demo)} alt="" width={demo.width} height={demo.height} loading="lazy" decoding="async" />
                  <Length seconds={demo.seconds} />
                </span>
                <span className="card-title">{c.demos[demo.id].title}</span>
                {demo.captions && <Sound label={c.demoSound} />}
              </a>
            </li>
          ))}
        </ul>
        {rows(demos).map((row) => (
          <div className={row.length > 1 ? "demo-row pair" : "demo-row"} key={row[0].id}>
            {row.map((demo) => {
              const text = c.demos[demo.id];
              return (
                <section className="demo" id={demo.id} key={demo.id}>
                  <h2>{text.title}</h2>
                  <p className="demo-meta">
                    <Length seconds={demo.seconds} />
                    {demo.captions && <Sound label={c.demoSound} />}
                  </p>
                  {text.caption && <p>{text.caption}</p>}
                  <video
                    controls
                    preload="none"
                    playsInline
                    poster={poster(demo)}
                    width={demo.width}
                    height={demo.height}
                    style={{ "--ratio": demo.width / demo.height } as CSSProperties}
                    src={`/videos/${demo.video}`}
                  >
                    {demo.captions && (
                      <track
                        kind="captions"
                        src={`/videos/${demo.video.replace(/\.mp4$/, `.${locale}.vtt`)}`}
                        srcLang={locale}
                        label={language}
                        default
                      />
                    )}
                  </video>
                </section>
              );
            })}
          </div>
        ))}
      </main>
    </Shell>
  );
}
