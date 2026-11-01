import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { Route } from "./+types/root";
import siteStylesheet from "./site.css?url";
import { localeForPath } from "./content";

export const links: Route.LinksFunction = () => [
  // The ICO, rendered from the SVG at 16, 32 and 48 pixels, for what takes no SVG icon.
  { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
  { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
  { rel: "stylesheet", href: siteStylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang={localeForPath(pathname)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
