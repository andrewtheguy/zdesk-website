import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { Route } from "./+types/root";
import siteStylesheet from "./site.css?url";
import { localeForPath } from "./content";

export const links: Route.LinksFunction = () => [
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
