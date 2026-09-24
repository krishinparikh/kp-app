---
Guide: backend
Description: How to build API code in this repo — which package owns what, the order to add an endpoint in, the database and error rules, and the checks that must pass.
---

# backend

Two packages make up the back end. Put each change in the one that owns it.

| Package           | Owns                                                          | Runs where               |
| ----------------- | ------------------------------------------------------------- | ------------------------ |
| `apps/server`     | The API — routes, business logic, database access (port 8000) | Node                     |
| `packages/shared` | Every request and response shape, as Zod schemas              | Node **and** the browser |

Three things own three different jobs, and none of them generates another:

- **Drizzle** (`src/db/schema.ts`) owns **storage** — what the database holds.
- **The contract** (`packages/shared`) owns **the wire** — what crosses HTTP.
- **The service** owns the **mapping** between them.

A column is not a field. Adding one to a table does not add it to the API, and
that is the point. See [frontend.md](frontend.md) for the client half.

## Where a new file goes

| You're adding                             | Put it in                                                     |
| ----------------------------------------- | ------------------------------------------------------------- |
| An endpoint on an existing resource       | that resource's `controller` + `service` in `modules/<name>/` |
| A whole new resource                      | `apps/server/src/modules/<name>/` + a line in `app.module.ts` |
| A request or response shape               | `packages/shared/src/{constants,schemas,types}/<name>.ts`     |
| A table or a column                       | `apps/server/src/db/schema.ts` + a migration                  |
| An environment variable                   | `apps/server/src/config/env.ts` + `.env.example`              |
| Anything app-wide (prefix, pipes, guards) | `apps/server/src/setup-app.ts` — **never** `main.ts`          |

`config/` and `db/` are infrastructure the whole app shares. Everything under
`modules/` is one slice of the API. If you're unsure which: does it name a
resource? A module. Does every module need it? Infrastructure.

## Naming

- Server files are `.ts` and **kebab-case**, in the pattern
  `<resource>.<role>.ts` — `users.controller.ts`, `users.service.ts`,
  `users.module.ts`, `users.controller.spec.ts`.
- Classes are PascalCase and match the file: `UsersController`.
- `apps/server` and `packages/shared` are both ESM (`nodenext`), so **relative
  imports need the `.js` extension** even though the file on disk is `.ts`:
  `import { UsersService } from './users.service.js'`.
- Imports from a workspace package use the package root:
  `import { user } from '@kp-app/shared'`, never a subfolder.

## Adding an endpoint

The order matters — the contract comes first, because both ends compile
against it.

1. **Write the contract.** Three files in `packages/shared/src`, all named
   after the resource, plus a line in each folder's `index.ts`:
   - `constants/<name>.ts` — the resource name and its path
   - `schemas/<name>.ts` — the Zod schemas
   - `types/<name>.ts` — `z.infer` of each schema
2. **Build it** — `pnpm --filter @kp-app/shared build`. The server runs
   compiled JS from `dist/`, so a schema you haven't built doesn't exist yet.
   The dev watcher does this for you; nothing else does.
3. **Change the table, if the data is new.** Edit `src/db/schema.ts`, then
   `make revision m="add accounts"` and `make migrate`.
4. **Write the module** — `src/modules/<name>/`, three files (below).
5. **Register it** in `app.module.ts`'s `imports`. A module not listed there
   serves nothing, with no error.
6. **Test both ways** — a `.spec.ts` beside the controller and an
   `.e2e-spec.ts` in `test/`.

Controllers take the **bare resource name** — `@Controller(usersResource)`. The
`/api/v1` prefix comes from `setup-app.ts`, and the contract's `*Path` exports
carry it for clients. Never hardcode it on either side.

### A module owns its parts

One folder per API slice, holding everything that slice needs and nothing else:

```sh
src/modules/users/
├── users.controller.ts        # HTTP only — routes, validation, status codes
├── users.service.ts           # the work — queries, business rules, errors
├── users.module.ts            # wiring: which controllers, which providers
└── users.controller.spec.ts   # the unit test, beside what it tests
```

- **The controller does HTTP, the service does work.** A Drizzle query in a
  controller is the smell; so is an `@Get()` in a service. The controller should
  read as a list of routes, each one line.
- **Keep the test beside the code.** `users.controller.spec.ts` lives in the
  module folder. Only end-to-end specs live apart, in `test/`, because they
  boot the whole app.
- **Don't reach into another module's folder.** If `accounts` needs
  `UsersService`, `UsersModule` adds it to `exports` and `AccountsModule` adds
  `UsersModule` to `imports`. Importing the class file without wiring the
  modules compiles fine and fails at runtime with a DI error.
- **The exception is `config/` and `db/`.** `DbModule` is `@Global()`, so no
  module imports it — inject the `DB` token directly.

```ts
constructor(@Inject(DB) private readonly db: Database) {}
```

- `nest g resource users` scaffolds into `src/users/`. Pass the path —
  `nest g resource modules/accounts` — or move the folder after.

## The contract

Every shape lives in `packages/shared` and is imported by both apps. Never
redeclare one locally, and never add a server-only DTO — a second copy is the
drift this package exists to prevent.

**Schemas describe the JSON on the wire, not your in-memory types.** A timestamp
is `z.string()`, never `z.date()`. Convert after parsing, in whichever app wants
a `Date`.

Validate with `@Body({ schema })`, `@Param('id', { schema })` or the `@Query`
equivalent. The global `StandardSchemaValidationPipe` in `app.module.ts` picks
these up. **The TypeScript annotation beside each one must be that schema's
`z.infer`** — NestJS does not cross-check them, so a wrong annotation compiles
and lies to you:

```ts
@Post()
create(@Body({ schema: createUserBody }) body: CreateUser): Promise<User> {
  return this.users.create(body)
}
```

The three folders stack one way — **constants ← schemas ← types** — and the
package may not use Node built-ins or browser globals, because it is bundled
for the browser and run on Node alike.

## Database

Tables live in `src/db/schema.ts`. Everything exported there is diffed against
the database when you generate a migration.

| Goal                     | With the stack up (`make up`)    | Without Docker                              |
| ------------------------ | -------------------------------- | ------------------------------------------- |
| Generate a migration     | `make revision m="add accounts"` | `pnpm --filter server db:generate --name=…` |
| Apply pending migrations | `make migrate`                   | `pnpm --filter server db:migrate`           |
| Browse the data          | —                                | `pnpm --filter server db:studio`            |

Migrations are checked in under `apps/server/drizzle/`. Never edit an applied
one — write another.

**Select columns explicitly once a table holds anything the API must not
expose.** A bare `select()` returns every column, so a password hash or an
internal flag added later flows straight to the client with nothing to stop it.

## Errors

Throw NestJS exceptions from the service; the controller shouldn't catch them:

```ts
if (!found) throw new NotFoundException(`No user with id ${id}`)
```

The body Nest produces is described by `apiErrorBody` in the contract, so the
web client can parse any failure. Use `apiErrorMessage` to flatten it — the
validation pipe returns a list of messages, not a string.

**Drizzle wraps driver errors.** A Postgres SQLSTATE like `23505` sits on
`error.cause`, not on the error you catch, so walk the cause chain rather than
reaching for a fixed depth. `hasSqlState` in `users.service.ts` is the pattern
to copy.

## Testing

Two suites, with different costs:

| Suite      | Command         | Files                | Needs Postgres |
| ---------- | --------------- | -------------------- | -------------- |
| Unit       | `pnpm test`     | `src/**/*.spec.ts`   | No             |
| End-to-end | `pnpm test:e2e` | `test/*.e2e-spec.ts` | **Yes**        |

- **Unit specs check wiring.** Mock the service, assert the controller passes
  arguments through. Don't mock Drizzle — that tests the mock.
- **E2E specs check the contract.** They run against the real database, so
  start one first (`make up`, or `docker compose up -d db`). Build the app with
  `Test.createTestingModule(...)` **and `configureApp(...)`** — the URL prefix
  lives there, and skipping it 404s every request.
- **Parse every e2e response with the contract schema.** That parse is what
  catches the API drifting from what the contract promises. Asserting on a bare
  object doesn't.
- Clear the tables you touch in `afterEach`, and `app.close()` in `afterAll`.

## Before you call it done

| Command          | Catches                                 |
| ---------------- | --------------------------------------- |
| `pnpm lint`      | Oxlint                                  |
| `pnpm typecheck` | Type errors                             |
| `pnpm test`      | Unit specs                              |
| `pnpm test:e2e`  | Contract drift — needs Postgres running |
| `pnpm format`    | Prettier                                |

Then update the docs. A change to structure or a guide belongs in `AGENTS.md`,
the relevant `docs/` file, and the folder's `README.md` — whichever apply.

## Silent failures to watch for

These produce no error, or an error far from the cause:

- **Setup placed in `main.ts`.** Tests build the app with
  `createNestApplication()`, which never runs `main.ts`, so anything configured
  there is missing from every e2e test. App-wide setup goes in `setup-app.ts`,
  which both call.
- **A stale `@kp-app/shared`.** The server runs `node dist/main` with no
  TypeScript loader, so it reads the package's built JS. Edit a schema outside
  the dev watcher and run `pnpm --filter @kp-app/shared build`.
- **A module missing from `app.module.ts`.** It compiles, boots, and serves
  nothing.
- **A `@Body` annotation that doesn't match its schema.** NestJS validates
  against the schema and types against the annotation, and never compares the
  two. Always use the schema's `z.infer`.
- **A bare `select()` after a column is added.** The new column ships to the
  client silently.
- **A `timestamp` column with `mode: 'string'`.** It yields Postgres's format
  (`2026-09-21 04:43:34+00`) — a space, not a `T`, so not ISO-8601 and not what
  the schema promises. Keep it a `Date` and convert where the row becomes a
  response. A `date` column is different: it already returns `YYYY-MM-DD`, which
  is why `users.dob` uses `mode: 'string'` correctly.
- **An empty `PATCH` body.** Drizzle emits invalid SQL for a `.set({})`.
  Short-circuit before the query, as `UsersService.update` does.
- **A request to a path outside the prefix.** It never reaches Nest — Express
  answers with an HTML 404, not the JSON error body the contract describes. Test
  error shapes against real handler errors, not routing misses.

## Reference

- [`apps/server/README.md`](../../apps/server/README.md) — scripts, layout, env vars
- [`packages/shared/README.md`](../../packages/shared/README.md) — the contract, and adding a resource
- [`packages/README.md`](../../packages/README.md) — the runtime boundary, and why `shared` builds
- `apps/server/src/modules/users/` — the worked example, end to end
