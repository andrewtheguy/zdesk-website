import type { CSSProperties, ReactNode } from "react";
import ICONS from "./icons";

export type IconName = keyof typeof ICONS;

// An inline status: beta, alpha, experimental, unofficial or QA only.
export function Tag({ kind, children }: { kind: "beta" | "alpha" | "experimental" | "unofficial" | "qa"; children: ReactNode }) {
  return <span className={`tag tag-${kind}`}>{children}</span>;
}

// A yes, a no or a neither in a table cell.
export function Mark({ value, children }: { value: "yes" | "no" | "none"; children?: ReactNode }) {
  return (
    <span className={`mark mark-${value}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {value === "yes" ? <path d="M5 12l5 5L20 7" /> : value === "no" ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M6 12h12" />}
      </svg>
      {children}
    </span>
  );
}

// Ways of reaching a gateway, each marked as taken or refused.
export function Routes({ routes }: { routes: { ok: boolean; title: ReactNode; body: ReactNode }[] }) {
  return (
    <ul className="routes">
      {routes.map((r, i) => (
        <li key={i} className={r.ok ? "ok" : "refused"}>
          <Mark value={r.ok ? "yes" : "no"} />
          <div>
            <strong>{r.title}</strong>
            <span>{r.body}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Groups of short items side by side, each under its heading.
export function Groups({ groups }: { groups: { title: ReactNode; items: ReactNode[] }[] }) {
  return (
    <div className="groups">
      {groups.map((g, i) => (
        <section key={i}>
          <h4>{g.title}</h4>
          <ul>
            {g.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// The picker's options as cards, each a link to its own part of the section.
export function Options({ items }: { items: { id: string; icon: IconName; title: ReactNode; body: ReactNode }[] }) {
  return (
    <ul className="options">
      {items.map((o) => (
        <li key={o.id}>
          <a href={`#${o.id}`}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              {ICONS[o.icon]}
            </svg>
            <strong>{o.title}</strong>
            <span>{o.body}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// A heading for one of a section's parts, with its icon.
export function Part({ id, icon, children }: { id: string; icon: IconName; children: ReactNode }) {
  return (
    <h3 className="part" id={id}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        {ICONS[icon]}
      </svg>
      {children}
    </h3>
  );
}

// A table that scrolls sideways on its own when the screen is narrower than it.
export function Table({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Alternatives side by side, each a card of the same rows.
export function Compare({
  items,
}: {
  items: { title: ReactNode; sub?: ReactNode; tag?: ReactNode; rows: [ReactNode, ReactNode][] }[];
}) {
  return (
    <div className="compare">
      {items.map((item, i) => (
        <section key={i}>
          <h4>
            {item.title} {item.tag}
          </h4>
          {item.sub && <p className="compare-sub">{item.sub}</p>}
          <dl>
            {item.rows.map(([k, v], j) => (
              <div key={j}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

// Keys and what each does.
export function Keys({ rows, head }: { head: [ReactNode, ReactNode]; rows: [string[], ReactNode][] }) {
  return (
    <Table
      head={head}
      rows={rows.map(([keys, action]) => [
        <span className="keys">
          {keys.map((k) => (
            <kbd key={k}>{k}</kbd>
          ))}
        </span>,
        action,
      ])}
    />
  );
}

// The session's page and the second display's tab side by side, with a window dragged over the
// edge between them.
export function TwoDisplays({ first, second, drag }: { first: ReactNode; second: ReactNode; drag: string }) {
  return (
    <figure className="diagram two-displays">
      <svg viewBox="0 0 640 230" role="img" aria-label={drag}>
        {[0, 330].map((x, i) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <rect className="frame" x="10" y="10" width="300" height="200" rx="10" />
            <path className="bar" d="M10 20a10 10 0 0 1 10-10h280a10 10 0 0 1 10 10v16H10z" />
            <circle className="dot" cx="26" cy="23" r="4" />
            <circle className="dot" cx="40" cy="23" r="4" />
            <rect className="url" x="60" y="17" width="200" height="12" rx="6" />
            <text className="number" x="160" y="150" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
        <g className="window">
          <rect x="230" y="70" width="190" height="96" rx="6" />
          <path d="M230 76a6 6 0 0 1 6-6h178a6 6 0 0 1 6 6v10H230z" />
        </g>
        <path className="drag" d="M180 196C260 222 380 222 470 192" />
        <path className="drag-head" d="M458 186l13 6-11 9" />
      </svg>
      <figcaption>
        <span>{first}</span>
        <span>{second}</span>
      </figcaption>
    </figure>
  );
}

// A frame from one of the demo recordings, taken from the original at its full size. A frame
// wider than 1600 pixels has a copy that wide beside it, `<name>-1600.webp`, for a 1x screen.
const STILLS = {
  "ipad-soft-keyboard": [2266, 1488],
  "rdp-picker": [940, 1000],
  "windows-retina": [3456, 2234],
  "mac-two-displays": [3840, 1080],
  "wlshare-retina": [3456, 2234],
  "local-instance": [3456, 2234],
} as const;

export function Still({ name, caption }: { name: keyof typeof STILLS; caption: ReactNode }) {
  const [width, height] = STILLS[name];
  const src = `/images/${name}.webp`;
  return (
    <figure className="still">
      <img
        src={src}
        srcSet={width > 1600 ? `/images/${name}-1600.webp 1600w, ${src} ${width}w` : undefined}
        sizes={width > 1600 ? "(max-width: 60rem) 100vw, 50rem" : undefined}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        // Every frame is a 2x screen's, so it is shown no wider than half its pixels.
        style={{ "--ratio": width / height, maxWidth: `min(100%, ${width / 2}px)` } as CSSProperties}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
