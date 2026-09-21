# KP App

Look at docs/ for more info on this project

## Code Standards
- Naming: use PascalCase for all .tsx files, kebab-case for all .ts files, and snake_case for all .py files
- Comments: keep them concise

## UI Components (packages/ui)
- Every app that renders a page imports `@kp-app/ui` — `web` (Vite) and `landing` (Next.js) both do. It owns the design tokens, the stylesheet, the shadcn primitives, and Storybook. An app holds only its own screens and app-specific components.
- Consume it with two lines: `@import '@kp-app/ui/styles.css'` in the app's CSS entry, and `import { Button } from '@kp-app/ui'` in the components. Never copy a primitive into an app.
- shadcn/ui components live in `packages/ui/src/components/primitives/`, one folder per component: `Button/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `index.ts`. `composites/` alongside it holds pieces built out of primitives that are still app-agnostic.
- Add components with `pnpm --filter @kp-app/ui ui:add <name>` — never by hand, and never straight from the shadcn CLI. The script reshapes the CLI's flat output into that layout.
- Every component needs both a story and a test. Tests are Vitest + Testing Library (jsdom); query by role and never assert on Tailwind classes.
- No shipped file in the package may use the `@/` alias — a consuming app maps `@` to its own `src`, so the import would resolve into the app. Primitives reach each other by relative path; `ui:add` rewrites the CLI's output.
- The package has no build step: `exports` point at `src/`, and consumers compile it. That only works because nothing on the server imports it. A Next.js consumer therefore needs `transpilePackages: ['@kp-app/ui']`.
- The primitives are vendored with `rsc: false`, so none carries `'use client'`. Stateless ones render fine as React Server Components; a file using an interactive one must add the directive itself.
- Details in `packages/ui/README.md`.

## Design Tokens (packages/ui)
- Two layers in `packages/ui/src/tokens/`: `primitives.css` holds raw values (`--neutral-500`, `--font-size-2`), `semantics.css` names roles pointing at exactly one primitive (`--muted-foreground: var(--neutral-500)`, `--text-body: var(--font-size-2)`). `theme.css` decides which become utility classes.
- This applies to EVERY scale, not just color: type, weight, leading, tracking, spacing, elevation, blur and motion all have a ramp in primitives and purpose-named roles in semantics. `theme.css` holds no literals.
- The sole exception is `--breakpoint-*` and `--container-*`, which must stay literal. CSS forbids `var()` inside a `@media`/`@container` condition, so indirecting one emits invalid CSS the browser drops, or no rule at all — silently. The linter enforces this.
- Keyframes live at the bottom of `theme.css`, outside `@theme`. Tailwind can't tie a keyframe to an `--animate-*` value that reads a var, and `--*: initial` deletes the ones Tailwind and tw-animate-css ship, so they must be declared explicitly or `animate-*` classes do nothing.
- Components may ONLY use semantic tokens — via Tailwind classes like `bg-muted`. Never a raw color (`#fff`, `oklch(...)`), never a primitive (`var(--neutral-500)`).
- `theme.css` opens with `--*: initial`, deleting every Tailwind default. Components can only use what that file declares — `bg-red-500`, `text-9xl`, `font-thin` and bare `rounded` all produce no CSS. Need something new? Add it to `theme.css` (or a semantic token first, for colors).
- `tokens/index.css` is the single stylesheet every app imports. Its `@source '../components'` line is load-bearing: Tailwind skips `node_modules`, so without it the classes used inside primitives generate no CSS.
- The package exposes the token linter as a `lint-tokens` binary. Every app's `lint` script runs `lint-tokens src` over its own code, so the rules hold app-side too.
- Details in `packages/ui/src/tokens/README.md`.

## API Contract (packages/contract)
- Every request and response shape is a Zod schema in `packages/contract`, imported by both apps. Never redeclare a shape locally, and never add a server-only DTO — a second copy is the drift this package exists to prevent.
- Schemas describe the JSON on the wire, not in-memory types: a timestamp is `z.string()`, never `z.date()`. Convert after parsing.
- Server: validate with `@Body({ schema })`. The parameter's TypeScript annotation must be that schema's `z.infer` — NestJS does not cross-check them.
- Web: all calls go through `api.get` / `api.post` / … in `apps/web/src/lib/api.ts`. The schema is always the second argument and drives the return type, so a drifted server throws at the boundary. Never call `axios` or `fetch` directly.
- The package compiles to `dist/`, so run `pnpm --filter @kp-app/contract build` after editing a schema outside the dev watcher.
- Drizzle owns storage, the contract owns the wire, and neither generates the other. `apps/server/src/modules/users/` is the worked example end to end.
- The API is mounted at `/api/v1`. Controllers take the bare resource name (`@Controller(usersResource)`); the prefix comes from `setup-app.ts` and the contract's `*Path` exports carry it for clients. Never hardcode `/api/v1` in a controller or a call site.
- Server code is split by role: `config/` and `db/` are shared infrastructure, `modules/<name>/` is one API slice each (module + controller + service).
- If a table gains a column the API must not expose, select columns explicitly in the service rather than `select()` — an extra column otherwise flows straight to the client.
- Details in `packages/contract/README.md`.

## Agentic Development
- Three main sources of documentation: AGENTS.md (CLAUDE.md is a symlink to it), docs/ files, and folder-specific README.md files. After making any changes, make sure the right documentation is subsequently changed too.
- 