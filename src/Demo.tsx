import Shell from "./Shell";
import { content, demos, type Locale } from "./content";

export default function Demo({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <Shell locale={locale} page="demo">
      <main>
        <h1>{c.demoTitle}</h1>
        <p className="tagline">{c.demoIntro}</p>
        <ul className="toc">
          {demos.map((demo) => (
            <li key={demo.id}>
              <a href={`#${demo.id}`}>{c.demos[demo.id].title}</a>
            </li>
          ))}
        </ul>
        {demos.map((demo) => {
          const text = c.demos[demo.id];
          return (
            <section className="demo" id={demo.id} key={demo.id}>
              <h2>{text.title}</h2>
              {text.caption && <p>{text.caption}</p>}
              <video
                className={demo.portrait ? "portrait" : undefined}
                controls
                preload="metadata"
                playsInline
                src={`/videos/${demo.video}`}
              />
            </section>
          );
        })}
      </main>
    </Shell>
  );
}
