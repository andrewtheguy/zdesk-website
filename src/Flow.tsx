import { Fragment, type ReactNode } from "react";

// Stages in a row, each joined to the next by what carries it; a column on narrow screens.
export default function Flow({
  stages,
  hops,
}: {
  stages: { icon: ReactNode; title: ReactNode; body: ReactNode }[];
  hops: ReactNode[];
}) {
  return (
    <ol className="flow">
      {stages.map((stage, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <li className="hop">
              <svg viewBox="0 0 48 12" aria-hidden="true">
                <path d="M6 1L1 6l5 5M1 6h46M42 1l5 5-5 5" />
              </svg>
              <span>{hops[i - 1]}</span>
            </li>
          )}
          <li className="stage">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              {stage.icon}
            </svg>
            <h3>{stage.title}</h3>
            <div>{stage.body}</div>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
