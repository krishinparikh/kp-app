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
| `pnpm test:e2e`    | End-to-end tests (`*.e2e-spec.ts`)            |
| `pnpm lint`        | Oxlint                                        |
| `pnpm typecheck`   | Type-check without emitting                   |
| `pnpm db:generate` | Generate a migration from schema changes      |
| `pnpm db:migrate`  | Apply pending migrations                      |
| `pnpm db:studio`   | Drizzle Studio, a browser UI for the database |

## Layout

```
src/
├── main.ts               # bootstrap, CORS, listen
├── app.module.ts         # root module, env loading
├── config/
│   ├── env.ts            # Zod-validated environment
│   └── database-url.ts   # URL scheme normalizing
├── db/
│   ├── db.module.ts      # global module providing the DB token
│   └── schema.ts         # Drizzle tables go here
└── health/
    └── health.controller.ts   # GET /health
```

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
