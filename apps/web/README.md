# web

React 19 + TypeScript + Vite 8, with Tailwind v4, React Router 8, shadcn/ui
components, Storybook, and Vitest.

Normally you'd run this via Docker from the repo root (`make up`). To run it on
its own, install from the **repo root** — this is a pnpm workspace package, so
installing here alone won't resolve anything:

```bash
pnpm install          # from the repo root
pnpm --filter web dev
```

| Script                 | What it does                            |
| ---------------------- | --------------------------------------- |
| `pnpm dev`             | Dev server on http://localhost:5173     |
| `pnpm build`           | Type-check and build to `dist/`         |
| `pnpm typecheck`       | Type-check without emitting             |
| `pnpm preview`         | Serve the production build              |
| `pnpm lint`            | Oxlint                                  |
| `pnpm test`            | Vitest, once                            |
| `pnpm test:watch`      | Vitest, watching                        |
| `pnpm storybook`       | Storybook on http://localhost:6006      |
| `pnpm build-storybook` | Static Storybook to `storybook-static/` |
| `pnpm ui:add <name>`   | Add a shadcn component (see below)      |
| `pnpm format`          | Prettier, writing in place              |
| `pnpm format:check`    | Prettier, check only                    |

## Layout

```
src/
├── main.tsx        # router setup
├── App.tsx         # layout shell, renders routes via <Outlet />
├── index.css       # Tailwind entry, imports the token layers
├── app/
│   ├── routes.ts   # the page list main.tsx maps over
│   ├── home/Page.tsx
│   └── about/Page.tsx
├── styles/         # design tokens
│   ├── primitives.css  # raw values
│   ├── semantics.css   # roles pointing at primitives
│   └── theme.css       # which tokens become utility classes
├── components/
│   └── primitives/   # shadcn/ui — one folder per component
│       └── Button/
│           ├── Button.tsx
│           ├── Button.stories.tsx
│           ├── Button.test.tsx
│           └── index.ts
└── lib/
    ├── api.ts        # fetch + parse against @kp-app/contract
    ├── site.ts
    └── utils.ts
```

## Notes

- Environment variables come from the **repo root** `.env`, not this directory —
  `vite.config.ts` sets `envDir: '../../'`. Only `VITE_`-prefixed vars reach the
  browser bundle.
- Tailwind v4 needs no config file. The `@tailwindcss/vite` plugin plus the
  imports at the top of `src/index.css` are the whole setup.
- Colors and radii go through two token layers in `src/styles/`: primitives
  (raw values) feed semantics (roles), and `theme.css` decides which become
  utility classes.
- `theme.css` starts with `--*: initial`, which deletes every Tailwind default.
  A component can only use what that file declares — `bg-red-500`, `text-9xl`
  and `font-thin` generate no CSS. `pnpm lint` names any that slip in. See
  `src/styles/README.md`.
- `@/` resolves to `src/`, declared in both `tsconfig.app.json` and
  `vite.config.ts`. shadcn components depend on it; keep the two in sync.
- UI components live in `src/components/primitives/`, one folder per component
  with its stories and tests beside it. Add one with `pnpm ui:add <name>` —
  see `src/components/primitives/README.md`.
- Tests are Vitest + Testing Library against jsdom, configured in
  `vitest.config.ts`. Storybook is separate and purely visual: stories are for
  looking at, `.test.tsx` files are for asserting.
- Pages live in `src/app/<name>/Page.tsx` and are listed in `src/app/routes.ts`,
  which `main.tsx` maps into `<Route>` elements.
- Every API call goes through `apiRequest` in `src/lib/api.ts`, which parses the
  response against a schema from `@kp-app/contract`. Never call `fetch`
  directly, and never redeclare a response shape here — the contract package is
  the one definition, shared with the server.
- Under Docker, file watching falls back to polling (`VITE_IN_DOCKER=1`), because
  macOS bind mounts don't forward filesystem events.
- Prettier and its ignore file live at the repo root, shared with `server`.
