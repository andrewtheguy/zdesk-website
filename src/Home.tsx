import { Fragment } from "react";
import { INSTALL_COMMAND, content, demos, locales, type Locale } from "./content";

export default function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <main>
      <p className="locales">
        {locales.map((l, i) => (
          <Fragment key={l.id}>
            {i > 0 && " | "}
            {l.id === locale ? (
              l.label
            ) : (
              <a href={l.path} lang={l.id}>
                {l.label}
              </a>
            )}
          </Fragment>
        ))}
      </p>

      <header>
        <h1>
          <img className="logo" src="/logo.svg" alt="" width="48" height="48" />
          zDesk
        </h1>
        <p className="tagline">{c.tagline}</p>
        <ul className="links">
          {c.links.map((link) => (
            <li key={link.href}>
              <a className={link.primary ? "primary" : undefined} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <p>{c.intro}</p>
      <ul>
        {c.targets.map((target, i) => (
          <li key={i}>{target}</li>
        ))}
      </ul>
      <p>{c.hosts}</p>
      <pre>
        <code>{c.diagram}</code>
      </pre>
      <p>{c.display}</p>

      <h2 id="demo">{c.demoHeading}</h2>
      {demos.map((demo) => {
        const text = c.demos[demo.id];
        return (
          <section className="demo" id={demo.id} key={demo.id}>
            <h3>{text.title}</h3>
            {text.caption && <p>{text.caption}</p>}
            <video
              className={demo.portrait ? "portrait" : undefined}
              controls
              preload="metadata"
              playsInline
              src={`/demo/${demo.video}`}
            />
          </section>
        );
      })}

      <h2 id="quick-start">{c.quickStartHeading}</h2>
      <p>{c.quickStart}</p>
      <pre>
        <code>{INSTALL_COMMAND}</code>
      </pre>
      <p>{c.docs}</p>

      <footer>
        <p>{c.footer}</p>
      </footer>
    </main>
  );
}
