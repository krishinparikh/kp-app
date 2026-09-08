# web

React 19 + TypeScript + Vite 8, with Tailwind v4 and React Router 8.

Normally you'd run this via Docker from the repo root (`make up`). To run it on
its own, install from the **repo root** — this is a pnpm workspace package, so
installing here alone won't resolve anything:

```bash
pnpm install          # from the repo root
pnpm --filter web dev
```

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Dev server on http://localhost:5173 |
| `pnpm build`        | Type-check and build to `dist/`     |
| `pnpm typecheck`    | Type-check without emitting         |
| `pnpm preview`      | Serve the production build          |
| `pnpm lint`         | Oxlint                              |
| `pnpm gen:api`      | Regenerate `src/lib/api-types.ts`   |
| `pnpm format`       | Prettier, writing in place          |
| `pnpm format:check` | Prettier, check only                |

## Layout

```
src/
├── main.tsx        # router setup
├── App.tsx         # layout shell, renders routes via <Outlet />
├── index.css       # Tailwind entry
├── app/
│   ├── routes.ts   # the page list main.tsx maps over
│   ├── home/Page.tsx
│   └── about/Page.tsx
└── lib/
    ├── api.ts        # typed client
    ├── api-types.ts  # GENERATED from the server's OpenAPI schema
    ├── site.ts
    └── utils.ts
```

## Notes

- Environment variables come from the **repo root** `.env`, not this directory —
  `vite.config.ts` sets `envDir: '../../'`. Only `VITE_`-prefixed vars reach the
  browser bundle.
- Tailwind v4 needs no config file. The `@tailwindcss/vite` plugin plus
  `@import 'tailwindcss'` in `src/index.css` is the whole setup.
- Pages live in `src/app/<name>/Page.tsx` and are listed in `src/app/routes.ts`,
  which `main.tsx` maps into `<Route>` elements.
- `src/lib/api-types.ts` is generated — don't edit it. Run `pnpm gen:api` with
  the server up (`make up`) after changing a server route or DTO.
- Under Docker, file watching falls back to polling (`VITE_IN_DOCKER=1`), because
  macOS bind mounts don't forward filesystem events.
- Prettier and its ignore file live at the repo root, shared with `server`.
