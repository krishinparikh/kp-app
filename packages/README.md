# Packages

Shared code. Everything here is imported by something in `apps/` and is never
deployed on its own.

```sh
packages/
└── ui/     # React component library
```

`ui/` is an empty placeholder — nothing has been extracted into it yet.

## Adding a package

1. Create the folder with a `package.json` named `@finance-app/<name>`.
2. Add it to a consumer's dependencies as `"@finance-app/<name>": "workspace:*"`.
3. Run `pnpm install` from the repo root to link it.

Keep the runtime boundary in mind: `web` bundles for the browser and `server`
runs on Node, so a package imported by both must avoid Node built-ins and
browser globals alike.
