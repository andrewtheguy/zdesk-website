import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { installs, type Platform } from "./content";

export default function InstallTabs({
  notes,
  tui,
}: {
  notes: Record<Platform, ReactNode>;
  tui: { intro: ReactNode; steps: ReactNode };
}) {
  const [selected, setSelected] = useState<Platform>(installs[0].id);
  const tabs = useRef<Partial<Record<Platform, HTMLButtonElement | null>>>({});

  // Arrow keys, Home and End move between tabs, as the ARIA tabs pattern has it.
  const onKeyDown = (e: KeyboardEvent) => {
    const i = installs.findIndex((p) => p.id === selected);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: installs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const id = installs[(next + installs.length) % installs.length].id;
    setSelected(id);
    tabs.current[id]?.focus();
  };

  return (
    <div className="install">
      <div className="install-tabs" role="tablist" onKeyDown={onKeyDown}>
        {installs.map((p) => (
          <button
            key={p.id}
            ref={(el) => {
              tabs.current[p.id] = el;
            }}
            type="button"
            role="tab"
            id={`install-tab-${p.id}`}
            aria-controls={`install-${p.id}`}
            aria-selected={p.id === selected}
            tabIndex={p.id === selected ? 0 : -1}
            onClick={() => setSelected(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {installs.map((p) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`install-${p.id}`}
          aria-labelledby={`install-tab-${p.id}`}
          hidden={p.id !== selected}
        >
          <pre>
            <code>{p.command}</code>
          </pre>
          <p className="install-note">{notes[p.id]}</p>
        </div>
      ))}
      <p className="install-then">{tui.intro}</p>
      <pre>
        <code>zdesk tui</code>
      </pre>
      <p className="install-note">{tui.steps}</p>
    </div>
  );
}
