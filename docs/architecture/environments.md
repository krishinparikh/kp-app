# environments

Configuration, ports, and the three ways to run this stack.

## One `.env`, three consumers

A single `.env` at the repo root feeds everything. Copy `.env.example` to get
started — every value there is already a working default.

| Consumer             | How it reads the root `.env`                      |
| -------------------- | ------------------------------------------------- |
| `docker-compose.yml` | `${VAR}` interpolation (only ever reads the root) |
| `apps/server`        | `@nestjs/config`, `envFilePath: '../../.env'`     |
| `apps/web`           | Vite, `envDir: '../../'`                          |

Three things worth knowing:

- **Only `VITE_`-prefixed variables reach the browser bundle**, so database
  credentials in this file stay server-side.
- **`DATABASE_URL` points at `localhost`** for native runs. Compose overrides it
  to the `db` service hostname inside containers.
- **The server validates its environment at boot** with Zod
  (`apps/server/src/config/env.ts`), so a missing or malformed value fails
  immediately instead of at first use.

`apps/landing` reads no environment at all.

## Ports

| Service   | Port | Set by           |
| --------- | ---- | ---------------- |
| `web`     | 5173 | `FRONTEND_PORT`  |
| `server`  | 8000 | `BACKEND_PORT`   |
| `db`      | 5432 | `POSTGRES_PORT`  |
| `landing` | 3000 | not configurable |
| Storybook | 6006 | not configurable |

Those variables change the **host** port mapping. Inside a container the service
always listens on its default.

## Three ways to run

### Everything in Docker

```bash
make up
```

The normal path. Source directories are bind-mounted, so edits hot-reload inside
the containers. `server` waits for `db` to pass its healthcheck; `web` waits for
`server`. `landing` is not in compose.

### Natively, against a containerized database

Faster loop, and you can attach a debugger. Install once from the repo root —
this is a workspace, so per-package installs won't resolve:

```bash
pnpm install
docker compose up -d db

pnpm --filter server dev    # http://localhost:8000
pnpm --filter web dev       # http://localhost:5173
pnpm --filter landing dev   # http://localhost:3000
```

### Mixed

Compose publishes every port to the host, so you can run one service natively
against the rest in Docker. Point `VITE_API_URL` at wherever the API actually
is.

## Deployed

Not set up yet. When it is, the shape is the same: one `.env` per environment,
`VITE_API_URL` pointing at the real API host, and `DATABASE_URL` at the managed
database.
