# @kp-app/contract

The API contract shared by `apps/server` and `apps/web`: Zod schemas, the types
inferred from them, and the route constants that go with them. Hand-written —
there is no code generation step.

```sh
src/
├── index.ts    # barrel, re-exports every module below
├── http.ts     # the error body every endpoint can return
└── health.ts   # one module per resource
```

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
- **Web** — `apiRequest` in `apps/web/src/lib/api.ts` parses every response
  against the schema. That parse is what catches the server drifting from the
  contract, which is the tradeoff of hand-writing it instead of generating it.

## Adding a resource

1. Add `src/<resource>.ts` with its path constant, schemas, and inferred types.
2. Re-export it from `src/index.ts` — remember the `.js` extension, this package
   compiles as `nodenext`.
3. Import from `@kp-app/contract` in either app. Never redeclare a response
   shape locally.

```ts
export const transactionsPath = '/transactions'

export const createTransactionBody = z.object({
  amountCents: z.number().int(),
  description: z.string().min(1),
})

export const transaction = createTransactionBody.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(), // string on the wire, not a Date
})

export type Transaction = z.infer<typeof transaction>
```

## Constraints

- **No Node built-ins, no browser globals.** This is bundled for the browser and
  run on Node. `types: []` in `tsconfig.json` enforces it.
- **No runtime imports beyond Zod.** Anything heavier belongs in the app.
- The package compiles to `dist/`. `apps/server` runs `node dist/main` with no
  TypeScript loader, so it consumes the built JS — which is why this package has
  a build step at all.
