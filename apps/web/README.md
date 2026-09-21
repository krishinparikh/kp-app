# web

React 19 + TypeScript + Vite 8, with Tailwind v4, React Router 8, and Vitest.
The design tokens and UI components come from
[`@kp-app/ui`](../../packages/ui/README.md), which also owns Storybook.

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
| `pnpm lint`         | Oxlint, then the token linter       |
| `pnpm test`         | Vitest, once                        |
| `pnpm test:watch`   | Vitest, watching                    |
| `pnpm format`       | Prettier, writing in place          |
| `pnpm format:check` | Prettier, check only                |

Storybook and `ui:add` live with the components:
`pnpm --filter @kp-app/ui storybook`.

## Layout

```
src/
├── main.tsx        # router setup
├── App.tsx         # layout shell, renders routes via <Outlet />
├── index.css       # one line: @import '@kp-app/ui/styles.css'
├── app/
│   ├── routes.ts   # the page list main.tsx maps over
│   ├── home/Page.tsx
│   └── about/Page.tsx
├── components/
│   └── common/     # app-only pieces; shared ones go in @kp-app/ui
└── lib/
    ├── api.ts      # axios client + contract parsing
    └── site.ts
```

## Notes

- Environment variables come from the **repo root** `.env`, not this directory —
  `vite.config.ts` sets `envDir: '../../'`. Only `VITE_`-prefixed vars reach the
  browser bundle.
- Tailwind v4 needs no config file. The `@tailwindcss/vite` plugin plus the one
  `@import` in `src/index.css` are the whole setup — that stylesheet pulls in
  Tailwind, the fonts, and the token layers from `@kp-app/ui`.
- Colors and radii go through two token layers in that package: primitives (raw
  values) feed semantics (roles), and `theme.css` decides which become utility
  classes.
- `theme.css` starts with `--*: initial`, which deletes every Tailwind default.
  A component can only use what that file declares — `bg-red-500`, `text-9xl`
  and `font-thin` generate no CSS. `pnpm lint` runs the package's `lint-tokens`
  binary over `src/`, which names any that slip in. See
  `packages/ui/src/tokens/README.md`.
- `@/` resolves to `src/`, declared in both `tsconfig.app.json` and
  `vite.config.ts`. Keep the two in sync, and note it points here, not into
  `@kp-app/ui` — which is why nothing in that package uses the alias.
- Shared UI comes from `@kp-app/ui`: `import { Button } from '@kp-app/ui'`.
  App-only components go in `src/components/common/`. See
  `packages/ui/README.md`.
- Tests are Vitest + Testing Library against jsdom, configured in
  `vitest.config.ts`; `vitest.setup.ts` re-exports the DOM stubs from
  `@kp-app/ui`. Component tests and stories live with the components, in the
  package.
- Pages live in `src/app/<name>/Page.tsx` and are listed in `src/app/routes.ts`,
  which `main.tsx` maps into `<Route>` elements.
- Every API call goes through `api.get` / `api.post` / … in `src/lib/api.ts`.
  The schema from `@kp-app/contract` is always the second argument and drives
  the return type, so a drifted server throws at the boundary. Never reach for
  `axios` or `fetch` directly, and never redeclare a response shape here.
- Under Docker, file watching falls back to polling (`VITE_IN_DOCKER=1`), because
  macOS bind mounts don't forward filesystem events.
- Prettier and its ignore file live at the repo root, shared with `server`.
