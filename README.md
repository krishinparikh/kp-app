# finance-app

A monorepo with a React frontend and a FastAPI backend, backed by PostgreSQL.

| Package             | Stack                                                    | Dev port |
| ------------------- | -------------------------------------------------------- | -------- |
| `packages/frontend` | React 19, TypeScript, Vite 8, Tailwind v4, React Router 8 | 5173     |
| `packages/backend`  | FastAPI, SQLModel, Alembic, Python 3.13 (uv)              | 8000     |
| `db` (compose only) | PostgreSQL 17                                             | 5432     |

## Prerequisites

Docker is the only hard requirement — it covers everything else.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Compose v2 or newer

To run services natively instead, you'll also want:

- [uv](https://docs.astral.sh/uv/) (installs and pins Python 3.13 itself)
- Node 20.19+ or 22.12+, and pnpm 11

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

- Frontend — http://localhost:5173
- API — http://localhost:8000
- Interactive API docs — http://localhost:8000/docs
- Health check — http://localhost:8000/health

Source directories are bind-mounted, so edits on your machine hot-reload inside
the containers. No rebuild needed unless you change dependencies.

Stop with `make down`. Add `-v` (via `make clean`) to also drop the database.

## Common tasks

All of these wrap `docker compose`, so the stack must be running.

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `make up`        | Start the stack in the background                     |
| `make down`      | Stop the stack, keeping the database volume           |
| `make build`     | Rebuild images (needed after dependency changes)      |
| `make logs`      | Tail logs from all services                           |
| `make ps`        | Show service status                                   |
| `make migrate`   | Apply Alembic migrations                              |
| `make revision`  | Autogenerate a migration — `make revision m="…"`      |
| `make test`      | Run the backend test suite                            |
| `make clean`     | Stop the stack **and delete the database volume**     |

## Configuration

A single `.env` at the repo root feeds all three consumers. Copy `.env.example`
to get started — every value there is already a working default.

| Consumer             | How it reads the root `.env`                      |
| -------------------- | ------------------------------------------------- |
| `docker-compose.yml` | `${VAR}` interpolation (only ever reads the root) |
| Backend              | pydantic-settings, `env_file="../../.env"`        |
| Frontend             | Vite, `envDir: '../../'`                          |

Two things worth knowing:

- Only `VITE_`-prefixed variables reach the browser bundle, so database
  credentials in this file stay server-side.
- `DATABASE_URL` in `.env` points at `localhost` for native runs. Compose
  overrides it to point at the `db` service hostname inside containers.

`.env` is gitignored. Commit changes to `.env.example` instead.

## Running natively

Useful when you want a faster frontend loop or a debugger attached. You still
need Postgres, so start just that service:

```bash
docker compose up -d db
```

**Backend** — uv creates the virtualenv and installs Python 3.13 on first run:

```bash
cd packages/backend
uv run fastapi dev app/main.py
```

**Frontend:**

```bash
cd packages/frontend
pnpm install
pnpm dev
```

Other package scripts: `pnpm build`, `pnpm lint` (oxlint), `pnpm format`
(Prettier). On the backend: `uv run pytest` and `uv run ruff check .`.

## Database migrations

Alembic reads the database URL from app settings and autogenerates against
`SQLModel.metadata`, so any model you import is picked up.

```bash
make revision m="add accounts table"   # generate
make migrate                            # apply
```

Review generated migrations before applying them — autogenerate is a good first
draft, not a finished one. There are no migrations yet.

## Layout

```
finance-app/
├── .env.example            # template for the root .env
├── docker-compose.yml
├── Makefile
├── docs/
└── packages/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py     # FastAPI app, CORS, /health
    │   │   ├── config.py   # pydantic-settings
    │   │   └── db.py       # engine + get_session dependency
    │   ├── alembic/
    │   └── tests/
    └── frontend/
        └── src/
            ├── main.tsx    # router setup
            ├── App.tsx     # layout shell
            └── routes/
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

**Frontend changes aren't reloading.** The container polls for file changes
because macOS bind mounts don't forward filesystem events. If polling stalls,
`docker compose restart frontend`.

**Dependency changes aren't picked up.** Dependencies install at image build
time. After editing `pyproject.toml` or `package.json`, run `make build`.
