/// <reference types="vite/client" />

import type { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { themeInitScript } from "../lib/theme";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Simple YT",
      },
      {
        name: "description",
        content:
          "A bright YouTube search tool built with TanStack Start, HeroUI, and Bun.",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <HeroUIProvider>
        <Outlet />
      </HeroUIProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning className="dark" data-theme="dark" lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
