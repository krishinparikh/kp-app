# landing

The public landing page. Next.js 16 (App Router) + React 19, styled entirely by
[`@kp-app/ui`](../../packages/ui/README.md).

```bash
pnpm install            # from the repo root
pnpm --filter landing dev
```

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Dev server on http://localhost:3000 |
| `pnpm build`        | Production build to `.next/`        |
| `pnpm start`        | Serve the production build          |
| `pnpm lint`         | Oxlint, then the token linter       |
| `pnpm typecheck`    | Type-check without emitting         |
| `pnpm format`       | Prettier, writing in place          |
| `pnpm format:check` | Prettier, check only                |

Port 3000, Next's default. Nothing else in the repo uses it — the API is on
8000, `web` on 5173, Postgres on 5432.

## Layout

```
src/app/
├── globals.css   # one line: @import '@kp-app/ui/styles.css'
├── layout.tsx    # <html>/<body> shell and metadata
└── page.tsx      # the page itself
```

## Notes

- **Every visual decision comes from `@kp-app/ui`.** Colors, radii, type scale
  and the Geist font all arrive through that one `@import`. This app declares no
  tokens and has no Tailwind config — v4 needs none.
- **`transpilePackages: ['@kp-app/ui']`** in `next.config.ts` is required. The
  package ships TypeScript source rather than a build, so Next has to compile it
  as first-party code. Without it the build fails on the package's `.tsx`.
- **Tailwind runs through PostCSS here**, not the Vite plugin `web` uses
  (`postcss.config.mjs`). The stylesheet is identical either way — that is the
  point of keeping the theme in CSS.
- **The primitives work as server components.** They're vendored with
  `rsc: false`, so none carries a `'use client'` directive; the ones with no
  state (`Button`, `Card`, `Badge`) render on the server as-is. Reach for an
  interactive one — `Dialog`, `Select`, anything with a Radix hook — and the
  file that uses it needs `'use client'` at the top.
- **`pnpm lint` runs the shared token linter** over `src/`, so a raw color or a
  deleted Tailwind default fails here exactly as it does in `web`.
