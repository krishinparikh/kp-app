# KP App

Look at docs/ for more info on this project

## Code Standards
- Naming: use PascalCase for all .tsx files, kebab-case for all .ts files, and snake_case for all .py files
- Comments: keep them concise

## UI Components (apps/web)
- shadcn/ui components live in `apps/web/src/components/primitives/`, one folder per component: `Button/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `index.ts`.
- Add components with `pnpm --filter web ui:add <name>` — never by hand, and never straight from the shadcn CLI. The script reshapes the CLI's flat output into that layout.
- Every component needs both a story and a test. Tests are Vitest + Testing Library (jsdom); query by role and never assert on Tailwind classes.
- Details in `apps/web/src/components/primitives/README.md`.

## Design Tokens (apps/web)
- Two layers in `apps/web/src/styles/`: `primitives.css` holds raw values (`--neutral-500`), `semantics.css` names roles pointing at exactly one primitive (`--muted-foreground: var(--neutral-500)`). `theme.css` decides which become utility classes.
- Components may ONLY use semantic tokens — via Tailwind classes like `bg-muted`. Never a raw color (`#fff`, `oklch(...)`), never a primitive (`var(--neutral-500)`).
- `theme.css` opens with `--*: initial`, deleting every Tailwind default. Components can only use what that file declares — `bg-red-500`, `text-9xl`, `font-thin` and bare `rounded` all produce no CSS. Need something new? Add it to `theme.css` (or a semantic token first, for colors).
- `pnpm --filter web lint` runs `scripts/lint-tokens.ts`, which fails the build on any layering violation.
- Details in `apps/web/src/styles/README.md`.

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