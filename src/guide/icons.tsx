// Strokes on a 24-unit grid, drawn in the accent colour inside an `.icon` disc.
const ICONS = {
  browser: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20M6 6.5h.01M9 6.5h.01" />
    </>
  ),
  gateway: (
    <>
      <rect x="3" y="3" width="18" height="7" rx="2" />
      <rect x="3" y="14" width="18" height="7" rx="2" />
      <path d="M7 6.5h.01M7 17.5h.01" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  key: <path d="M15.5 7.5l3 3M21 2l-9.6 9.6M15.5 7.5L19 4M7.5 21a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  size: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  sound: <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />,
  picture: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" />
    </>
  ),
  displays: (
    <>
      <rect x="1" y="5" width="10" height="8" rx="1.5" />
      <rect x="13" y="5" width="10" height="8" rx="1.5" />
      <path d="M4 17h4M6 13v4M16 17h4M18 13v4" />
    </>
  ),
  graphics: <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z" />,
  camera: (
    <>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </>
  ),
  terminal: <path d="M4 17l6-6-6-6M12 19h8" />,
  pin: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 12h.01M10.5 12h.01M14 12h.01M17 12h.01" />
    </>
  ),
};

export default ICONS;
