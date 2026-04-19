<video src="./docs/demo.mov" controls width="100%"></video>

Simple YouTube search with a TanStack Start rewrite, Bun runtime, HeroUI components, and a bright editorial theme with dark mode by default.

## Stack

- Bun
- TanStack Start
- HeroUI
- Tailwind CSS v4
- `youtube-sr`
- Oxlint + Oxfmt
- TypeScript beta

## Scripts

```bash
bun run dev
bun run build
bun run preview
bun run lint
bun run format
bun run typecheck
bun run check
```

## How it works

### Routing

TanStack Start uses file-based routing under `src/routes/`. Each file exports a `Route` created with `createFileRoute`. The generated `src/routeTree.gen.ts` is auto-updated by the Vite plugin — never edit it by hand.

- `__root.tsx` — wraps every page in `<HeroUIProvider>` and injects the theme init script into `<head>` before any paint
- `index.tsx` — the search page; owns the URL state (`q`, `time`, `video` params) and loader
- `player.tsx` — bare iframe page opened by the mini player button via `window.open()`

### Data flow

1. User types a query → URL param `?q=` is updated via `useNavigate`
2. TanStack Router's `loader` fires on the server, calls `searchVideos` server function
3. Results are serialized and streamed to the client as loader data
4. The component reads `Route.useLoaderData()` — no client-side fetch, no useEffect data fetching

### Server functions

Server functions are registered with `createServerFn` from `@tanstack/react-start`. The Vite plugin detects these at build time and splits them into separate server-only bundles, automatically exposing them as HTTP endpoints. Calling a server function from the client transparently becomes a fetch to that endpoint.

**Why the split file pattern:**

```
src/lib/youtube.functions.ts  ← imported by both client and server
src/lib/youtube.server.ts     ← server-only, never sent to the browser
```

`youtube.functions.ts` defines the `searchVideos` server function. Its `.handler()` uses a dynamic `import('./youtube.server')` so the heavy `youtube-sr` scraping logic (and all of Node's `http` internals it pulls in) is never bundled into the client. The client only sees the function signature and the generated fetch stub.

### Theme

`src/lib/theme.ts` exports a minified inline script (`themeInitScript`) injected as a render-blocking `<script>` in `<head>`. It reads `localStorage` and sets `data-theme` + the `dark` class on `<html>` before the first paint, eliminating the flash of wrong theme on hard refresh. See the JSDoc in that file for the full explanation.

### Search strategy

`youtube.server.ts` tries `youtube-sr` first (up to 2 attempts), then falls back to a raw HTML fetch + custom `ytInitialData` parser if the library fails. Both paths apply the time filter and cap at 24 results.
