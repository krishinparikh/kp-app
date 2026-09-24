# kp-app

An opinionated bootstrap for agent-first, full-stack apps. Four principles shape
everything in it:

- **Harness-agnostic** — Claude Code, Codex, Cursor, or none of the above.
  Shared instructions live in `AGENTS.md`, so no single tool owns the project.
- **Type-safe end to end** — one set of types spans the database, API and UI,
  checked at runtime on both sides. Agents write better code against a contract
  that's enforced rather than inferred, and that payoff grows with the codebase.
- **Opinionated framework** — NestJS gives every piece of code one obvious place
  to live, so agents stay on rails instead of inventing a structure per feature.
- **Lightweight** — nothing is built for scale it doesn't have. Need Python? Add
  a service under `apps/` and call it over HTTP rather than bending the stack.

## How to work here

The documentation is structured rather than prose, because agents read it as
often as people do. Every fact has exactly one home, and everything else points
at it. That holds for you too — when you want to know something, follow the
chain instead of searching the code:

1. **[`AGENTS.md`](AGENTS.md)** — the index. Says which doc covers what, and
   which ones are still empty. Start here every time.
2. **A guide in [`docs/guides/`](docs/guides/)** — how to build a particular
   kind of thing. Read the relevant one _before_ writing code, not after; each
   ends with a list of mistakes that fail silently in this stack.
3. **The `README.md` beside the code** — how that one folder works.
4. **The code.**

When you finish a change, update whichever of those still describe it. That is
the only way the chain stays worth following.

### Finding the right doc

| You want to know                         | Read                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| What is this system, roughly?            | [architecture/high-level.md](docs/architecture/high-level.md)         |
| Where does this file belong?             | [architecture/file-structure.md](docs/architecture/file-structure.md) |
| How do I build a page or component?      | [guides/frontend.md](docs/guides/frontend.md)                         |
| How do I add an endpoint or a table?     | [guides/backend.md](docs/guides/backend.md)                           |
| Can an agent edit this doc or config?    | [guides/update-harness.md](docs/guides/update-harness.md)             |
| How do env vars, ports and running work? | [architecture/environments.md](docs/architecture/environments.md)     |

## Prerequisites

Docker is the only hard requirement — it covers everything else.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Compose v2 or newer
- To run services natively instead: Node 22.12+ (24 recommended) and pnpm 11

## Quick start

```bash
git clone <repo-url> kp-app
cd kp-app
cp .env.example .env
make up
```

First run pulls base images and installs dependencies, so expect a few minutes.
Later runs are fast. Then:

- Web app — http://localhost:5173
- API — http://localhost:8000/api/v1 (e.g. `/api/v1/users`)
- Health check — http://localhost:8000/health

Source directories are bind-mounted, so edits hot-reload in the containers. Stop
with `make down`, or `make clean` to also drop the database.

Other ways to run — natively, or a mix — are in
[environments.md](docs/architecture/environments.md).

## Everyday commands

`make` wraps `docker compose`, so the stack must be running:

| Command         | What it does                                      |
| --------------- | ------------------------------------------------- |
| `make up`       | Start the stack in the background                 |
| `make down`     | Stop it, keeping the database volume              |
| `make build`    | Rebuild images — needed after dependency changes  |
| `make logs`     | Tail logs from all services                       |
| `make migrate`  | Apply Drizzle migrations                          |
| `make revision` | Generate a migration — `make revision m="…"`      |
| `make clean`    | Stop the stack **and delete the database volume** |

Turborepo drives tasks across packages, container or not:

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Run every package's dev server                      |
| `pnpm build`     | Build every package                                 |
| `pnpm typecheck` | Type-check every package                            |
| `pnpm lint`      | Lint every package, including the token linter      |
| `pnpm test`      | Test every package                                  |
| `pnpm storybook` | Storybook for `@kp-app/ui` on http://localhost:6006 |
| `pnpm format`    | Prettier across the repo                            |

Target one package with `--filter`, e.g. `pnpm --filter server test`.

## Troubleshooting

**Port already allocated.** Something else holds 5432, 8000 or 5173 — often
another project's Postgres. Stop it, or change `POSTGRES_PORT` /
`BACKEND_PORT` / `FRONTEND_PORT` in `.env`.

**Ports look wrong after a failed start.** Compose reuses a container when the
config hasn't changed, so one created during a failed run can linger without its
port bindings. Force it: `docker compose up -d --force-recreate db`.

**Web changes aren't reloading.** The container polls, because macOS bind mounts
don't forward filesystem events. If polling stalls, `docker compose restart web`.

**Dependency changes aren't picked up.** Dependencies install at image build
time. After editing any `package.json` or the lockfile, run `make build`.

**A schema edit didn't reach the API.** `nest start --watch` only watches
`apps/server/src`, so a change to `packages/shared` alone needs
`docker compose restart server`. Editing a schema _and_ the controller that uses
it — the normal case — restarts on its own.

**`pnpm install` complains about ignored build scripts.** Postinstall approvals
live under `allowBuilds` in `pnpm-workspace.yaml`. Add the package there — `true`
to let it build, `false` to silence it.
