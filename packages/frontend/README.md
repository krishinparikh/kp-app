# frontend

React 19 + TypeScript + Vite 8, with Tailwind v4 and React Router 8.

Normally you'd run this via Docker from the repo root (`make up`). To run it on
its own:

```bash
pnpm install
pnpm dev
```

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Dev server on http://localhost:5173 |
| `pnpm build`        | Type-check and build to `dist/`     |
| `pnpm preview`      | Serve the production build          |
| `pnpm lint`         | Oxlint                              |
| `pnpm format`       | Prettier, writing in place          |
| `pnpm format:check` | Prettier, check only                |

## Notes

- Environment variables come from the **repo root** `.env`, not this directory —
  `vite.config.ts` sets `envDir: '../../'`. Only `VITE_`-prefixed vars reach the
  browser bundle.
- Tailwind v4 needs no config file. The `@tailwindcss/vite` plugin plus
  `@import 'tailwindcss'` in `src/index.css` is the whole setup.
- Routes live in `src/routes/` and are registered in `src/main.tsx`. `App.tsx` is
  the layout shell that renders them via `<Outlet />`.
- Under Docker, file watching falls back to polling (`VITE_IN_DOCKER=1`), because
  macOS bind mounts don't forward filesystem events.
