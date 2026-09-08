# finance-app

A pnpm + Turborepo monorepo with a React web app and a NestJS API, backed by
PostgreSQL.

| Package             | Stack                                                     | Dev port |
| ------------------- | --------------------------------------------------------- | -------- |
| `apps/web`          | React 19, TypeScript, Vite 8, Tailwind v4, React Router 8 | 5173     |
| `apps/server`       | NestJS 12, Drizzle ORM, Zod, TypeScript                   | 8000     |
| `db` (compose only) | PostgreSQL 17                                             | 5432     |

`apps/` holds deployables; `packages/` holds code shared between them. See
[apps/README.md](apps/README.md) and [packages/README.md](packages/README.md).

## Prerequisites

Docker is the only hard requirement — it covers everything else.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Compose v2 or newer

To run services natively instead, you'll also want:

- Node 22.12+ (24 recommended) and pnpm 11

## Quick start

```bash
git clone <repo-url> finance-app
cd finance-app
cp .env.example .env
make up
```

That builds the images and starts all three services. First run pulls base
images and installs dependencies, so expect a few minutes; later runs are fast.

Once it's up:

- Web app — http://localhost:5173
- API — http://localhost:8000
- Interactive API docs — http://localhost:8000/docs
- OpenAPI schema — http://localhost:8000/openapi.json
- Health check — http://localhost:8000/health

Source directories are bind-mounted, so edits on your machine hot-reload inside
the containers. No rebuild needed unless you change dependencies.

Stop with `make down`. Add `-v` (via `make clean`) to also drop the database.

## Common tasks

The `make` targets wrap `docker compose`, so the stack must be running.

| Command         | What it does                                      |
| --------------- | ------------------------------------------------- |
| `make up`       | Start the stack in the background                 |
| `make down`     | Stop the stack, keeping the database volume       |
| `make build`    | Rebuild images (needed after dependency changes)  |
| `make logs`     | Tail logs from all services                       |
| `make ps`       | Show service status                               |
| `make migrate`  | Apply Drizzle migrations                          |
| `make revision` | Generate a migration — `make revision m="…"`      |
| `make test`     | Run the server test suite                         |
| `make lint`     | Lint every workspace package                      |
| `make clean`    | Stop the stack **and delete the database volume** |

Turborepo drives tasks across packages from the repo root, container or not:

| Command          | What it does                   |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Run every package's dev server |
| `pnpm build`     | Build every package            |
| `pnpm typecheck` | Type-check every package       |
| `pnpm lint`      | Lint every package             |
| `pnpm test`      | Test every package             |
| `pnpm format`    | Prettier across the repo       |

Target one package with `--filter`, e.g. `pnpm --filter server test`.

## Configuration

A single `.env` at the repo root feeds all three consumers. Copy `.env.example`
to get started — every value there is already a working default.

| Consumer             | How it reads the root `.env`                      |
| -------------------- | ------------------------------------------------- |
| `docker-compose.yml` | `${VAR}` interpolation (only ever reads the root) |
| `apps/server`        | `@nestjs/config`, `envFilePath: '../../.env'`     |
| `apps/web`           | Vite, `envDir: '../../'`                          |

Three things worth knowing:

- Only `VITE_`-prefixed variables reach the browser bundle, so database
  credentials in this file stay server-side.
- `DATABASE_URL` in `.env` points at `localhost` for native runs. Compose
  overrides it to point at the `db` service hostname inside containers.
- The server validates its environment with Zod at boot (`src/config/env.ts`),
  so a missing or malformed value fails immediately instead of at first use.

## Running natively

Useful when you want a faster loop or a debugger attached. Install once from the
repo root — this is a workspace, so per-package installs won't resolve:

```bash
pnpm install
```

You still need Postgres, so start just that service:

```bash
docker compose up -d db
```

Then run either app:

```bash
pnpm --filter server dev    # http://localhost:8000
pnpm --filter web dev       # http://localhost:5173
```

## Database migrations

Drizzle generates SQL migrations by diffing `apps/server/src/db/schema.ts`
against the database. Migration files land in `apps/server/drizzle/`.

```bash
make revision m="add accounts table"   # generate
make migrate                            # apply
```

Review generated migrations before applying them — the diff is a good first
draft, not a finished one. There are no migrations yet, and `schema.ts` has no
tables.

`pnpm --filter server db:studio` opens Drizzle Studio, a browser UI for the
database. `db:push` skips migration files and syncs the schema directly, which
is convenient while prototyping and a bad idea anywhere else.

## Sharing types with the web app

The server publishes an OpenAPI schema at `/openapi.json`, generated from its
controllers and DTOs. The web app turns that into a typed client:

```bash
make up                     # server needs to be running
pnpm --filter web gen:api   # rewrites apps/web/src/lib/api-types.ts
```

After that, `api.GET('/health')` in `apps/web/src/lib/api.ts` is fully typed and
a server change surfaces in the web app as a type error. Re-run `gen:api`
whenever you change a route or DTO.

## Layout

```
finance-app/
├── .env.example            # template for the root .env
├── docker-compose.yml
├── Makefile
├── turbo.json              # task graph and caching
├── pnpm-workspace.yaml     # workspace members
├── docs/
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── main.ts     # bootstrap, CORS, Swagger, listen
│   │   │   ├── app.module.ts
│   │   │   ├── config/     # Zod-validated environment
│   │   │   ├── db/         # Drizzle client + schema
│   │   │   └── health/     # GET /health
│   │   ├── drizzle/        # generated migrations
│   │   └── test/
│   ├── web/
│   │   └── src/
│   │       ├── main.tsx    # router setup
│   │       ├── App.tsx     # layout shell
│   │       ├── app/        # pages + route list
│   │       └── lib/        # typed API client
│   ├── landing/            # empty placeholder
│   ├── mcp-app/            # empty placeholder
│   └── mobile/             # empty placeholder
└── packages/
    └── ui/                 # empty placeholder
```

## Troubleshooting

**Port already allocated.** Something else on your machine holds 5432, 8000, or
5173 — often another project's Postgres. Either stop it, or change
`POSTGRES_PORT` / `BACKEND_PORT` / `FRONTEND_PORT` in `.env` and `make up`.

**Ports look wrong after a failed start.** Compose reuses an existing container
when the config hasn't changed, so a container created during a failed run can
linger without its port bindings. Force it:

```bash
docker compose up -d --force-recreate db
```

**Web changes aren't reloading.** The container polls for file changes because
macOS bind mounts don't forward filesystem events. If polling stalls,
`docker compose restart web`.

**Dependency changes aren't picked up.** Dependencies install at image build
time. After editing any `package.json` or the lockfile, run `make build`.

**`pnpm install` complains about ignored build scripts.** Approved and denied
postinstall scripts are listed under `allowBuilds` in `pnpm-workspace.yaml`. Add
the package there — `true` to let it build, `false` to permanently silence it.
