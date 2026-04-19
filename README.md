

https://github.com/user-attachments/assets/b6e08c0b-c8e5-4d04-80e1-8274f98771ab

# 📺 Simple YT

A snappy YouTube search engine powered by **TanStack Start**, **Bun**, and **HeroUI**. Features a bright editorial theme with a rock-solid dark mode by default. ⚡️

---

## 🛠️ Stack

- 🍞 **Bun** — Runtime & Package Manager
- 🚀 **TanStack Start** — Full-stack React framework
- ✨ **HeroUI** — Polished UI components
- 🎨 **Tailwind CSS v4** — Utility-first styling
- 🕵️ **youtube-sr** — YouTube scraping/searching
- 🛠️ **Oxlint + Oxfmt** — Blazing fast linting & formatting
- 🔷 **TypeScript beta** — Cutting-edge type safety

## 🚀 Scripts

```bash
bun run dev       # Start development server
bun run build     # Build for production
bun run preview   # Preview production build
bun run lint      # Lint with Oxlint
bun run format    # Format with Oxfmt
bun run typecheck # Check types
bun run check     # Run all checks
```

## 🧠 How it works

### 🗺️ Routing

TanStack Start uses file-based routing under `src/routes/`. The generated `src/routeTree.gen.ts` is auto-updated by the Vite plugin — **never edit it by hand.**

- `__root.tsx` — Wraps every page in `<HeroUIProvider>` and injects the theme init script.
- `index.tsx` — The search engine; manages URL state (`q`, `time`, `video`) and server loaders.
- `player.tsx` — Bare iframe page for the mini-player.

### 🌊 Data flow

1. **User types** → URL param `?q=` updates via `useNavigate`.
2. **Loader fires** → TanStack Router's server loader calls `searchVideos`.
3. **Streaming** → Results are serialized and streamed to the client.
4. **Zero-Fetch UI** → Component reads `Route.useLoaderData()` — no client-side `useEffect` or manual fetches required. 🪄

### ⚡ Server functions

Registered with `createServerFn`. The Vite plugin splits these into server-only bundles and exposes them as HTTP endpoints.

> [!NOTE]
> **Why the split file pattern?**
> - `youtube.functions.ts` — Imported by both client and server (defines the signature).
> - `youtube.server.ts` — Server-only logic, never sent to the browser.
>
> This keeps heavy dependencies like `youtube-sr` and Node internals out of your client bundle. 📦

### 🎨 Theme

`src/lib/theme.ts` exports `themeInitScript`, a minified script injected into `<head>`. It reads `localStorage` and sets the theme **before the first paint**, eliminating that annoying "flash of unstyled content" (FOUC). 🌗

### 🔍 Search strategy

`youtube.server.ts` uses a resilient dual-path strategy:
1. **Primary**: `youtube-sr` (with retries).
2. **Fallback**: Raw HTML fetch + custom `ytInitialData` parser.

Both paths respect time filters and cap results at 24 for optimal performance. 🏎️
