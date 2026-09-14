# Finance App

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

## Agentic Development
- Three main sources of documentation: CLAUDE.md, docs/ files, and folder-specific README.md files. After making any changes, make sure the right documentation is subsequently changed too.
- 