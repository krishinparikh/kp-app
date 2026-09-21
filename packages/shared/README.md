# @kp-app/shared

The API contract shared by `apps/server` and `apps/web`: Zod schemas, the types
inferred from them, and the route constants that go with them. Hand-written —
there is no code generation step.

```sh
src/
├── index.ts      # barrel, re-exports all three folders
├── constants/    # resource names and paths — depends on nothing
│   ├── http.ts     the /api/v1 prefix
│   ├── health.ts   one file per resource
│   └── users.ts
├── schemas/      # the Zod schemas, which read the constants
│   ├── http.ts     the error body every endpoint can return
│   ├── health.ts
│   └── users.ts
└── types/        # the types inferred from those schemas
    ├── http.ts
    ├── health.ts
    └── users.ts
```

The three folders stack in one direction — **constants ← schemas ← types** —
and each has its own `index.ts`. Consumers never import a subfolder; everything
comes from the package root, so the layout can change without touching an app:

```ts
import { usersPath, user, type User } from '@kp-app/shared'
```

A resource keeps the same filename in each folder, so `users` is three small
files rather than one long one. `apiErrorMessage` in `schemas/http.ts` is the
package's only function; it sits with the schema it reads rather than in
`types/`.

## Why schemas and not interfaces

A shared `interface` describes what you _intend_ to send. A schema describes
what actually crosses the wire, and can check it at runtime.

That distinction matters most around serialization. A Drizzle `timestamp` column
infers as `Date` in TypeScript, but JSON has no date type — it arrives as a
string. An interface saying `createdAt: Date` type-checks and then crashes.
**Schemas here describe the JSON shape**: `z.string()` for a timestamp, never
`z.date()`. Convert after parsing, in the app that needs a `Date`.

## Both ends enforce it

- **Server** — `@Body({ schema })` plus the global `StandardSchemaValidationPipe`
  registered as `APP_PIPE` in `apps/server/src/app.module.ts` validates
  requests. Zod 4 implements Standard Schema, so its schemas plug into NestJS
  directly with no adapter. (It's a module provider rather than
  `useGlobalPipes` so tests, which build the app without running `main.ts`,
  get it too.)
- **Web** — the `api` helpers in `apps/web/src/lib/api.ts` parse every response
  against the schema. That parse is what catches the server drifting from the
  contract, which is the tradeoff of hand-writing it.

## Adding a resource

Three files, one per folder, all named after the resource. Remember the `.js`
extension on every relative import — this package compiles as `nodenext`.

```ts
// constants/transactions.ts
import { apiPrefix } from './http.js'

export const transactionsResource = 'transactions'
export const transactionsPath = `${apiPrefix}/${transactionsResource}`
```

```ts
// schemas/transactions.ts
import { z } from 'zod'

export const createTransactionBody = z.object({
  amountCents: z.number().int(),
  description: z.string().min(1),
})

export const transaction = createTransactionBody.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(), // string on the wire, not a Date
})
```

```ts
// types/transactions.ts
import type { z } from 'zod'

import type { transaction } from '../schemas/transactions.js'

export type Transaction = z.infer<typeof transaction>
```

Then add a line to each folder's `index.ts`. The root barrel picks them up from
there. Import from `@kp-app/shared` in either app, and never redeclare a
response shape locally.

## Constraints

- **No Node built-ins, no browser globals.** This is bundled for the browser and
  run on Node. `types: []` in `tsconfig.json` enforces it.
- **No runtime imports beyond Zod.** Anything heavier belongs in the app.
- The package compiles to `dist/`. `apps/server` runs `node dist/main` with no
  TypeScript loader, so it consumes the built JS — which is why this package has
  a build step at all, and why it differs from
  [`@kp-app/ui`](../ui/README.md), which ships source because only bundlers
  read it.
