# server

NestJS 12 (ESM) + Drizzle ORM on PostgreSQL, TypeScript, Vitest.

Normally you'd run this via Docker from the repo root (`make up`). To run it on
its own you still need Postgres, so start that first:

```bash
docker compose up -d db
pnpm --filter server dev
```

| Script             | What it does                                  |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Dev server on http://localhost:8000, watching |
| `pnpm build`       | Compile to `dist/`                            |
| `pnpm start:prod`  | Run the compiled build                        |
| `pnpm test`        | Unit tests (`*.spec.ts`)                      |
| `pnpm test:e2e`    | End-to-end tests — **needs Postgres running** |
| `pnpm lint`        | Oxlint                                        |
| `pnpm typecheck`   | Type-check without emitting                   |
| `pnpm db:generate` | Generate a migration from schema changes      |
| `pnpm db:migrate`  | Apply pending migrations                      |
| `pnpm db:studio`   | Drizzle Studio, a browser UI for the database |

## Layout

```
src/
├── main.ts               # bootstrap, CORS, listen
├── setup-app.ts          # URL prefix + versioning, shared with e2e tests
├── app.module.ts         # root module, env loading
├── config/
│   ├── env.ts            # Zod-validated environment
│   └── database-url.ts   # URL scheme normalizing
├── db/
│   ├── db.module.ts      # global module providing the DB token
│   └── schema.ts         # Drizzle tables
└── modules/              # one folder per feature module
    ├── health/
    │   └── health.controller.ts   # GET /health
    └── users/            # the worked example: full CRUD over one table
        ├── users.controller.ts
        ├── users.service.ts
        └── users.module.ts
```

`config/` and `db/` are infrastructure the whole app shares. Everything under
`modules/` is a slice of the API — a module, its controller, and its service.
A new feature is a new folder there plus a line in `app.module.ts`.

Note `nest g resource users` scaffolds into `src/users/` by default, so pass
the path — `nest g resource modules/accounts` — or move the folder after.

## Notes

- Environment variables come from the **repo root** `.env`, not this directory —
  `app.module.ts` sets `envFilePath: '../../.env'`. Inside Docker that file is
  absent and compose injects the values as real environment variables instead.
- `config/env.ts` validates the environment with Zod at boot, so a missing or
  malformed variable fails immediately rather than at first use. Defaults there
  mirror `.env.example`.
- Inject the database with the `DB` token, typed as `Database`:

  ```ts
  constructor(@Inject(DB) private readonly db: Database) {}
  ```

- `DbModule` is `@Global()`, so no feature module needs to import it.
- The connection pool closes on shutdown via `enableShutdownHooks()` in
  `main.ts`. Skip that and containers hang on SIGTERM.
- This package is ESM (`"type": "module"`), so relative imports need the `.js`
  extension even though the files are `.ts`.
- **The API is served under `/api/v1`**, via `setGlobalPrefix('api')` plus URI
  versioning in `setup-app.ts`. `/health` is excluded from both and stays at
  the root — probes and the compose healthcheck want a URL a version bump
  doesn't move. A v2 endpoint is per-controller:
  `@Controller({ path: 'users', version: '2' })`.
- **Anything app-wide goes in `setup-app.ts`, not `main.ts`.** Tests build the
  app with `createNestApplication()`, which never runs `main.ts`, so setup
  placed there is silently missing from every e2e test.
- **A path outside the prefix isn't Nest's.** Unmatched routes fall through to
  Express and get an HTML 404, not the JSON error body the contract describes.
  Assert error shapes against real handler errors, not routing misses.
- **`test:e2e` talks to a real database.** Start one with `docker compose up -d
db` (or `make up`) first. Each spec clears the tables it touches in
  `afterEach`. Unit tests (`pnpm test`) need nothing.
- **Drizzle wraps driver errors.** A Postgres SQLSTATE like `23505` sits on
  `error.cause`, not on the error you catch, so walk the cause chain — see
  `hasSqlState` in `users.service.ts`.
- **Adding a timestamp column costs more than it looks.** `timestamp(...,
{ mode: 'string' })` seems right for the wire but yields Postgres's format
  (`2026-09-21 04:43:34+00`) — a space, not a `T`, so not ISO-8601. Keep it a
  `Date` and convert to ISO where the row becomes a response, then record the
  conversion in the contract check as a mapped type. A `date` column is
  different: it already hands back `YYYY-MM-DD`, so `mode: 'string'` is
  correct there and needs no conversion — which is why `users.dob` uses it.
