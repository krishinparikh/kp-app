---
Guide: testing
Description: What makes a test worth keeping — the contracts to anchor one to, the patterns to copy, and the tautologies to reject.
---

# testing

A test is only worth keeping if it can fail while the code is wrong.

The way that goes wrong here is specific: **a test derived from the
implementation.** Read the code, describe what it does, assert that. It passes
whether the code is correct or not, it locks in every bug as expected
behaviour, and it fails only when someone refactors. Agents write these by
default, because the implementation is the easiest thing in the room to read.

Write from the **intended behaviour** instead, and anchor the assertion to
something you cannot read off the code you are testing.

## Anchors

| Anchor                  | Lives in                       | Why the implementation can't fake it            |
| ----------------------- | ------------------------------ | ----------------------------------------------- |
| **The contract**        | `@kp-app/shared` Zod schemas   | Declared separately; production parses with it  |
| **Real Postgres**       | the compose `db` service       | Enforces constraints no TypeScript declares     |
| **The real framework**  | Nest's router, validation pipe | Decides what actually exists at runtime         |
| **Accessibility roles** | `getByRole`, `user-event`      | What a person perceives, not your DOM           |
| **A stated invariant**  | the test itself                | True for every input, however the code is built |

A test with no anchor is a restatement. If you can't name which one it uses,
say what failure it would catch — and if there isn't one, don't write it.

## Patterns

### Parse with the contract, don't restate the shape

```ts
// Good — the schema is an independent statement of truth
const created = user.parse(response.body)

// Bad — restates the fields the handler happens to return today
expect(response.body).toEqual({ id: expect.any(String), firstName: 'Ada', ... })
```

Every e2e response goes through its contract schema. That parse is what catches
the API drifting from what clients expect; a hand-written object cannot, because
it was copied from the handler.

### Assert the invariant, not the arithmetic

```ts
// Good — holds for any input, whatever the formula
expect(percentOf(spent, limit)).toBeLessThanOrEqual(100)

// Bad — recomputes the implementation and compares it to itself
expect(percentOf(412, 600)).toBe(Math.round((412 / 600) * 100))
```

### Read the real thing, not your model of it

`src/setup-app.int.test.ts` asks Nest which routes it registered, then checks every
`*Path` a client imports is among them. `apiPrefix` is a literal that nothing
type-checks against the server, so this is the only thing standing between a
version bump and a silent 404.

### Drive the UI the way a person does

Query by role, act with `user-event`, and cover the states a person can land
in — pending, error, empty, loaded — not the props. Never assert on a Tailwind
class; those change whenever the tokens do.

### Let the database be the database

`users.service.ts` maps SQLSTATE `23505` to a 409. Test that against real
Postgres by inserting a duplicate. Mocking Drizzle to reject with a fake error
tests the fake.

## Anti-patterns

| Don't                              | Why                                                             |
| ---------------------------------- | --------------------------------------------------------------- |
| Mock a module you own              | You write the mock and the assertion from one mental model      |
| Snapshot a rendered component      | Locks in current output, bugs included; diffs get waved through |
| Restate a type the compiler knows  | `tsc` already checked it                                        |
| Assert a class name or `data-*`    | Implementation detail, and tokens move                          |
| Test a barrel, getter or re-export | Coverage theatre                                                |
| Write a test to reach a number     | Coverage finds untested risk; it is not a target                |
| Name a test after a function       | `it('configureApp works')` describes nothing that can fail      |

One mocked controller spec per app is enough as an example of the wiring — more
is noise. `users.controller.unit.test.ts` is that example.

## Prove it red

Before claiming a test passes, **break the line it covers and watch it fail**,
then revert. A test that stays green through a deliberate break asserts
nothing.

This is the one check that catches a tautological test mechanically, it costs
one edit, and it is not optional when you wrote the code and its test in the
same pass — nothing else distinguishes a real assertion from an echo of what
you just wrote.

## Three kinds, named in the filename

Every test file ends in `.unit.test`, `.int.test` or `.e2e.test`. The suffix is
how the suites are selected, so it is not decoration — pick it by what the test
is allowed to touch.

| Suffix       | Real collaborators              | Mocked                             | Cost    |
| ------------ | ------------------------------- | ---------------------------------- | ------- |
| `.unit.test` | One unit. A component counts    | Everything it owns                 | ms      |
| `.int.test`  | Several of ours, wired together | The outside edge — HTTP, the clock | ~100ms  |
| `.e2e.test`  | The whole system, its real door | Nothing                            | seconds |

Which to write follows from the anchors above: `.e2e.test` gets the database and
the framework, `.int.test` gets the contract, `.unit.test` gets invariants and
roles. An anchorless `.unit.test` is the tautology this guide exists to prevent,
so if a unit test is the only kind you can think of, that's the signal to check
what it would catch.

Where they live:

| Package           | Kind         | Path                  | Tests                                                           |
| ----------------- | ------------ | --------------------- | --------------------------------------------------------------- |
| `packages/shared` | `.unit.test` | `src/**`              | Schema behaviour — what a schema accepts, rejects, and flattens |
| `packages/ui`     | `.unit.test` | beside the component  | One component, by role, against jsdom                           |
| `apps/web`        | `.int.test`  | beside the module     | Hooks and the API client, network mocked                        |
| `apps/server`     | `.unit.test` | beside the controller | Wiring — mock the service, assert what it receives              |
| `apps/server`     | `.int.test`  | beside the module     | The real app, no database — e.g. the registered URL space       |
| `apps/server`     | `.e2e.test`  | `test/`               | The contract, against real Postgres                             |

Server e2e must build the app with `configureApp(...)` as well as
`Test.createTestingModule(...)`. The version prefix lives there, and skipping
it 404s every request.

## Before you call it done

| Command          | Runs                                         |
| ---------------- | -------------------------------------------- |
| `pnpm test`      | Unit + integration — everything databaseless |
| `pnpm test:unit` | Just the fast ones                           |
| `pnpm test:int`  | Just the wired ones                          |
| `pnpm test:e2e`  | Contract drift — needs Postgres running      |
| `pnpm typecheck` | What no test should be asserting             |

Each works from the repo root, via turbo, or inside one package with
`pnpm --filter <name> test:unit`.

## Silent failures to watch for

**A suite nobody runs.** `test:e2e` is not part of `pnpm test` and needs a
database, so the suite guarding the contract is the one least likely to
execute. Run it before touching anything the contract describes.

**A suffix that lies.** The filename decides which suite a test lands in.
Name an e2e test `.int.test` and it joins the databaseless run, where it fails
for reasons that have nothing to do with the code.

**A green test over broken code.** The symptom is a test that has never failed.
If you can't remember watching it go red, it may not be wired to anything.

**Coverage rising while risk doesn't.** Tier-3 tests move the number. Read
which lines are uncovered instead of the percentage.

**An e2e test that leaves rows behind.** Clear the tables you touch in
`afterEach` and `app.close()` in `afterAll`, or the next run fails on data the
last one wrote.

## Reference

- [`docs/guides/backend.md`](backend.md) — the two server suites and how to run them
- [`docs/guides/frontend.md`](frontend.md) — querying by role, and what not to assert
- [`packages/shared/README.md`](../../packages/shared/README.md) — the contract every e2e parses with
