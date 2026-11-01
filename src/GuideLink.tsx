// A hero's way into its guide, as a link under the buttons rather than one of them.
export default function GuideLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="guide-link">
      <a href={href}>
        <svg className="book" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
        </svg>
        {label}
        <span aria-hidden="true">→</span>
      </a>
    </p>
  );
}
