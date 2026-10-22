import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <main className="grain relative flex min-h-svh flex-col justify-between overflow-hidden bg-background px-6 py-6 text-foreground md:px-12 md:py-8">
      <div className="glow-floor pointer-events-none absolute inset-0 opacity-80" />

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <Link
          to="/"
          className="select-none font-serif text-2xl normal-case italic tracking-normal transition-opacity hover:opacity-80"
        >
          aj.
        </Link>
        <span className="text-muted-foreground">404</span>
      </header>

      {/* loud center content */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-12 text-center">
        <h1
          className="select-none font-display uppercase leading-[0.78] tracking-tight text-foreground"
          style={{ fontSize: "clamp(130px, 30vw, 360px)" }}
        >
          404
        </h1>

        <p className="mt-4 font-serif text-3xl italic text-primary sm:text-4xl md:text-5xl">
          Lost in the dark.
        </p>

        <p className="mt-4 max-w-sm text-xs uppercase tracking-[0.25em] text-muted-foreground sm:text-sm">
          This page doesn't exist or moved elsewhere.
        </p>

        <div className="mt-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 border border-border bg-card/50 px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
            >
              ←
            </span>
            <span>Back home</span>
          </Link>
        </div>
      </div>

      {/* footer */}
      <footer className="relative z-10 flex justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Antony Johny</span>
        <span>Page not found</span>
      </footer>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Antony Johny" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
