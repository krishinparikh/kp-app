---
Doc: ci
Description: The one workflow, what it runs, and what it does not.
---

# ci

One workflow, one job: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
It runs on every push to `main` and on every pull request.

| Step             | Catches                                 |
| ---------------- | --------------------------------------- |
| `pnpm install`   | A lockfile that doesn't match manifests |
| `pnpm lint`      | Oxlint, and token-layer violations      |
| `pnpm typecheck` | Type errors across every package        |
| `pnpm test`      | Unit + integration — no database needed |
| `pnpm build`     | Anything that compiles only in dev      |
| `pnpm test:e2e`  | Contract drift, against real Postgres   |

`--frozen-lockfile` is the reason `install` can fail: adding a dependency
without committing `pnpm-lock.yaml` breaks CI and nothing else.

A `postgres:17-alpine` service — the same image as `docker-compose.yml` — backs
the last step. `DATABASE_URL_TEST` points at it, and `apps/server/test/setup.ts`
creates and migrates `kp_test` itself, so there is no migration step here.

`DATABASE_URL_TEST` is listed in `turbo.json`'s `globalEnv`. Turbo strips any
variable not declared there, so without that line the step reaches the wrong
database and fails on authentication.

Steps run in cost order, so a type error fails in seconds rather than after the
database spins up.

## Not here yet

- **No deploy.** Nothing is published or released by this workflow.
- **No caching beyond pnpm's store.** Turbo's cache is local only; every run
  builds from scratch.
- **No browser tests.** There is no deployed environment to drive. See
  [testing.md](../guides/testing.md).
