# kp-app

An opinionated bootstrap for agent-first, full-stack apps. Inspired by these guiding principles:

- **Harness-agnostic** — Claude Code, Codex, Cursor, or none of the above.
  Shared instructions live in `AGENTS.md`, so no single tool owns the project.
- **Type-safe end to end** — one set of types spans the database, API, and UI.
  The API contract is a package both apps import, checked at runtime on both
  sides. Agents write better code against a contract that's enforced rather
  than inferred, and that payoff grows with the codebase.
- **Opinionated framework** — NestJS gives every piece of code one obvious
  place to live. Modules, controllers, and services keep agents on the MVC
  rails instead of inventing a new structure per feature, so the codebase stays
  organized as it grows.
- **Lightweight** — nothing is built for scale it doesn't have. It's a
  monorepo: if you need Python, add a service under `apps/` and call it over
  HTTP instead of bending the stack around it.

| Package              | Stack                                                                | Dev port |
| -------------------- | -------------------------------------------------------------------- | -------- |
| `apps/web`           | React 19, TypeScript, Vite 8, Tailwind v4, React Router 8, shadcn/ui | 5173     |
| `apps/web` Storybook | Component workshop for `src/components/primitives/`                  | 6006     |
| `apps/server`        | NestJS 12, Drizzle ORM, Zod, TypeScript                              | 8000     |
| `db` (compose only)  | PostgreSQL 17                                                        | 5432     |

`apps/` holds deployables; `packages/` holds code shared between them. See
[apps/README.md](apps/README.md) and [packages/README.md](packages/README.md).

## Prerequisites

Docker is the only hard requirement — it covers everything else.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Compose v2 or newer

To run services natively instead, you'll also want:

- Node 22.12+ (24 recommended) and pnpm 11

## Quick start

```bash
git clone <repo-url> kp-app
cd kp-app
cp .env.example .env
make up
```

That builds the images and starts all three services. First run pulls base
images and installs dependencies, so expect a few minutes; later runs are fast.

Once it's up:

- Web app — http://localhost:5173
- API — http://localhost:8000
- Health check — http://localhost:8000/health
- API — http://localhost:8000/api/v1 (e.g. `/api/v1/users`)

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

| Command          | What it does                                 |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Run every package's dev server               |
| `pnpm build`     | Build every package                          |
| `pnpm typecheck` | Type-check every package                     |
| `pnpm lint`      | Lint every package                           |
| `pnpm test`      | Test every package                           |
| `pnpm storybook` | Run Storybook (web) on http://localhost:6006 |
| `pnpm format`    | Prettier across the repo                     |

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

## The API contract

`packages/shared` holds the request and response shapes as Zod schemas, with
the TypeScript types inferred from them. Both apps import it, so there is one
definition per endpoint and no generation step — edit a schema and both sides
move together.

It splits into three folders that stack in one direction, one file per resource
in each:

```ts
// constants/health.ts
export const healthPath = '/health'
export const healthStatuses = ['ok', 'degraded'] as const

// schemas/health.ts — reads the constants
export const healthResponse = z.object({ status: z.enum(healthStatuses) })

// types/health.ts — reads the schemas
export type HealthResponse = z.infer<typeof healthResponse>
```

Apps import from the package root, never a subfolder.

Both ends enforce it at runtime, not just at compile time:

- **Server** — `@Body({ schema })` plus the global `StandardSchemaValidationPipe`
  in `app.module.ts` validates incoming requests. Zod 4 implements Standard
  Schema, so its schemas plug into NestJS directly.
- **Web** — the `api` helpers in `apps/web/src/lib/api.ts` parse every response
  against the schema, so a server that has drifted from the contract fails at
  the boundary instead of leaking a wrong shape into the UI.

The schemas describe the JSON on the wire, not in-memory types: a timestamp is
`z.string()`, never `z.date()`. See
[packages/shared/README.md](packages/shared/README.md).

The package compiles to `dist/`, because the server runs `node dist/main` with
no TypeScript loader. `pnpm dev` and `make up` both run a `tsc --watch` for it,
so day to day you just edit a schema. One wrinkle: `nest start --watch` only
watches `apps/server/src`, so a **shared-package-only** edit needs
`docker compose restart server` to reach the API. Editing a schema and the
controller that uses it — the normal case — restarts on its own.

## Documentation

Three places hold project knowledge, and each has a job:

- `AGENTS.md` at the repo root — the rules every agent and contributor follows.
  `CLAUDE.md` is a symlink to it, so no single tool owns the instructions.
- `docs/` — the longer-form context that doesn't fit in a rules file.
- `README.md` inside a folder — how that specific folder works, next to the
  code it describes.

```
docs/
├── product/
│   ├── prd.md              # what we're building and why
│   └── user-journeys.md    # the flows a user moves through
├── architecture/
│   ├── high-level.md       # how the system fits together
│   ├── file-structure.md   # where code goes and why
│   └── db.csv              # the data model
├── rules/
│   ├── frontend-design.md  # UI conventions
│   └── write-documentation.md
└── workflows/
    ├── sdlc.md             # how a change gets from idea to shipped
    └── zero-to-one.md      # how a new project gets off the ground
```

These files are scaffolded but still empty — fill them in as the project takes
shape. When you change something, update the doc that covers it.

## Layout

```
kp-app/
├── .env.example            # template for the root .env
├── docker-compose.yml
├── Makefile
├── turbo.json              # task graph and caching
├── pnpm-workspace.yaml     # workspace members
├── docs/
│   ├── product/            # PRD, user journeys
│   ├── architecture/       # system design, file structure, data model
│   ├── rules/              # conventions agents follow
│   └── workflows/          # how work gets done
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── main.ts     # bootstrap, CORS, listen
│   │   │   ├── app.module.ts
│   │   │   ├── config/     # Zod-validated environment
│   │   │   ├── db/         # Drizzle client + schema
│   │   │   └── modules/    # one folder per feature module
│   │   │       ├── health/ # GET /health
│   │   │       └── users/  # CRUD example over the users table
│   │   ├── drizzle/        # generated migrations
│   │   └── test/
│   ├── web/                # Vite + React Router
│   │   └── src/
│   │       ├── main.tsx    # router setup
│   │       ├── App.tsx     # layout shell
│   │       ├── app/        # pages + route list
│   │       ├── components/ # app-only components
│   │       └── lib/        # API client, parses against the schemas
│   ├── landing/            # Next.js landing page
│   │   └── src/app/        # App Router
│   ├── mcp-app/            # empty placeholder
│   └── mobile/             # empty placeholder
└── packages/
    ├── shared/             # the API contract
    │   └── src/
    │       ├── constants/  # resource names and paths
    │       ├── schemas/    # Zod schemas
    │       └── types/      # types inferred from the schemas
    └── ui/                 # design tokens + React components
        └── src/
            ├── tokens/     # primitives, semantics, theme
            └── components/ # shadcn primitives + composites
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
