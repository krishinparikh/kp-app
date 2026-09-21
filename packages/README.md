# Packages

Shared code. Everything here is imported by something in `apps/` and is never
deployed on its own.

```sh
packages/
├── contract/   # the API contract — Zod schemas, types, route constants
└── ui/         # React component library
```

`contract/` is imported by both apps and is the single definition of every
request and response shape. See [contract/README.md](contract/README.md).

`ui/` is an empty placeholder — nothing has been extracted into it yet.

## Adding a package

1. Create the folder with a `package.json` named `@kp-app/<name>`.
2. Add it to a consumer's dependencies as `"@kp-app/<name>": "workspace:*"`.
3. Run `pnpm install` from the repo root to link it.

Keep the runtime boundary in mind: `web` bundles for the browser and `server`
runs on Node, so a package imported by both must avoid Node built-ins and
browser globals alike. `contract/tsconfig.json` turns that rule into a compiler
error with `lib: ["ES2023"]` and `types: []` — `document` and `process` are both
unavailable there. Copy that pair into any package both apps import.

A package the server imports must also emit JavaScript. `apps/server` runs
`node dist/main` with no TypeScript loader, and `nest build` compiles only
`apps/server/src`, so raw `.ts` from a workspace package can't reach it.
