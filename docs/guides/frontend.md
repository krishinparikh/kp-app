---
Guide: frontend
Description: How to build UI in this repo — which package owns what, where a new file goes, the styling and data rules, and the checks that must pass.
---

# frontend

Three packages make up the front end. Put each change in the one that owns it.

| Package        | Owns                                                                | Knows about features? |
| -------------- | ------------------------------------------------------------------- | --------------------- |
| `packages/ui`  | Design tokens, the stylesheet, shadcn primitives, Storybook         | No                    |
| `apps/web`     | The product app — screens, routing, data fetching (Vite, port 5173) | Yes                   |
| `apps/landing` | The public marketing page (Next.js App Router, port 3000)           | Yes                   |

`packages/shared` sits underneath both apps and owns every request and response
shape. See [backend.md](backend.md) for the server half.

## Where a new file goes

| You're adding                       | Put it in                                                    |
| ----------------------------------- | ------------------------------------------------------------ |
| A screen in the product app         | `apps/web/src/app/<name>/Page.tsx` + an entry in `routes.ts` |
| A piece used by **one page**        | `apps/web/src/app/<name>/components/`                        |
| A piece used by **several pages**   | `apps/web/src/components/common/`                            |
| A piece a **second app** would want | `packages/ui/src/components/composites/`                     |
| A shadcn building block             | `pnpm --filter @kp-app/ui ui:add <name>` — never by hand     |
| A color, size, shadow or easing     | `packages/ui/src/tokens/` — see [the token rules](#styling)  |
| A request or response shape         | `packages/shared/src/schemas/` — never inline in a component |

Components move **outward** as they get reused: start beside the page, promote
to `components/common/` on the second page that wants it, promote to
`packages/ui` on the second app. Never start a component further out than it
needs to be — a shared folder full of one-caller components is harder to read
than a page folder that holds its own parts.

If you can't decide between an app and `packages/ui`: does it name a feature,
a route, or a piece of business data? App. Otherwise `packages/ui`.

## Naming

- `.tsx` files are **PascalCase** (`Page.tsx`, `Button.tsx`).
- `.ts` files are **kebab-case** (`routes.ts`, `api.ts`, `lint-tokens.ts`).
- Only `index.ts` barrels break the PascalCase rule inside a component folder.
- Imports carry the file extension (`./App.tsx`, `./app/routes.ts`) — match it.

## Adding a page to `web`

1. Create `src/app/<name>/Page.tsx` with a **default export**.
2. Add one line to `src/app/routes.ts`: `{ path, title, nav, Page }`.

That list is the single source of truth — the route tree, the header nav, and
the document title all read from it. A page not listed there renders nothing.
Omit `nav` to keep a page out of the header.

Product-wide strings (the app's name, its description) live in
`src/lib/site.ts`, not inline.

### A page owns its parts

Don't let a page grow into one long file. Break each meaningful section into
its own component in a `components/` folder **inside that page's folder**, and
import it into `Page.tsx`:

```sh
src/app/home/
├── Page.tsx              # composes the sections, holds the page's own state
└── components/
    ├── StatCards.tsx
    ├── TransactionTable.tsx
    └── BudgetList.tsx
```

```tsx
// src/app/home/Page.tsx
import { StatCards } from './components/StatCards.tsx'
import { TransactionTable } from './components/TransactionTable.tsx'
```

Why keep them here rather than in `src/components/common/`:

- **The blast radius is obvious.** A component in the page folder has exactly
  one caller. You can change it, or delete it with the page, without searching
  the app for other users.
- **`Page.tsx` stays readable.** It reads as an outline of the screen — which
  sections there are and in what order — instead of hundreds of lines of markup.
- **Reuse stays honest.** Moving a component to `common/` becomes a deliberate
  step that says "more than one page needs this", rather than the default.

Rules for these components:

- **Named exports**, PascalCase file names matching the component. The default
  export is reserved for `Page.tsx`, which is what `routes.ts` imports.
- **Nest no deeper than `components/`.** A page folder is `Page.tsx` plus one
  `components/` folder — if that folder is getting unwieldy, the page probably
  wants splitting into routes.
- **No barrel `index.ts`.** Import the file directly; there are too few to
  justify one, and a barrel hides how much a page pulls in.
- They may import from `@kp-app/ui`, `src/components/common/`, and `src/lib/`.
  They must **not** import from another page's folder — if two pages want the
  same piece, that's the signal to promote it to `components/common/`.

## Styling

**Only semantic tokens, only through Tailwind classes.** `bg-muted`,
`text-muted-foreground`, `rounded-lg`. Never a raw color (`#fff`, `oklch(...)`),
never a primitive (`var(--neutral-500)`).

**Tailwind's defaults do not exist here.** `theme.css` opens with
`--*: initial`, which deletes every value Tailwind ships — the palette, but also
most of the type, weight, shadow and radius scales. `bg-red-500`, `text-9xl`,
`font-thin` and bare `rounded` all generate **no CSS and no error**. Whatever
`theme.css` declares is the complete list of what you may use.

Need something that isn't there? Add it — a primitive value, then a semantic
role, then the `theme.css` line that exposes it. Don't reach for a literal.

Structural utilities (`flex`, `grid-cols-3`, `items-center`, `absolute`) carry
no design decision and are unaffected.

Full detail: [`packages/ui/src/tokens/README.md`](../../packages/ui/src/tokens/README.md).

## Components

Import shared UI by package name, never by copying a file:

```tsx
import { Button, Card, cn } from '@kp-app/ui'
```

Inside `packages/ui`, components reach each other by **relative path**. The
`@/` alias must not appear in any shipped file there — a consuming app maps `@`
to its own `src`, so the import would resolve into the app.

Every component in `packages/ui` needs four files in its own folder:
`Name.tsx`, `Name.stories.tsx`, `Name.test.tsx`, `index.ts`. `ui:add` scaffolds
all four; fill in the stubs, then run `pnpm format`.

Tests are Vitest + Testing Library against jsdom. Query by role, drive the UI
with `user-event`, and **never assert on a Tailwind class** — those change
whenever the tokens do. Overlays open for real in tests; use `findByRole` for
portalled content, which only exists once open.

## Data

Every call in `web` goes through `apps/web/src/lib/api.ts`:

```ts
const users = await api.get(usersPath, userList)
```

The schema from `@kp-app/shared` is always the second argument and drives the
return type, so a server that drifts throws at the boundary instead of leaking
bad data into the UI. Never call `axios` or `fetch` directly, never redeclare a
shape in the app, and never hardcode `/api/v1` — the `*Path` exports carry it.

There is no server-state library yet. If a screen needs caching, adding one is
a decision to raise, not a default to assume.

For a mock screen with no endpoint behind it, hold the placeholder data in the
component file and say so in a comment. Don't add a "use mocks" flag to
`api.ts` — it would branch shipped code and skip the schema parse that client
exists for.

## Before you call it done

Run these in the package you touched, or `pnpm <script>` at the root for all:

| Command          | Catches                                                       |
| ---------------- | ------------------------------------------------------------- |
| `pnpm lint`      | Oxlint, then the token linter — the silent CSS failures above |
| `pnpm typecheck` | Type errors                                                   |
| `pnpm test`      | Vitest (`web` and `packages/ui`; `landing` has no suite)      |
| `pnpm format`    | Prettier                                                      |

Then update the docs. A change to structure or a guide belongs in `AGENTS.md`,
the relevant `docs/` file, and the folder's `README.md` — whichever apply.

## Silent failures to watch for

These produce no error, or an error far from the cause:

- **A deleted Tailwind class.** No CSS, no warning. `pnpm lint` names it.
- **`lucide-react` from an app.** It's a dependency of `packages/ui` only and
  will not resolve from `apps/web` or `apps/landing`. Add it to that app's
  `package.json` first, or leave the icon out.
- **A missing `TooltipProvider`.** Every Radix tooltip needs one above it. The
  app tree has one in `main.tsx`; a test must wrap its own.
- **An interactive primitive in `landing`.** The primitives are vendored with
  `rsc: false`, so none carries `'use client'`. Stateless ones render fine as
  server components; anything with a Radix hook needs the directive on the file
  that uses it.
- **A stale `@kp-app/shared`.** It compiles to `dist/`. After editing a schema
  outside the dev watcher, run `pnpm --filter @kp-app/shared build`.
- **A new Next.js consumer without `transpilePackages: ['@kp-app/ui']`.** The
  package ships TypeScript source, so Next must compile it as first-party code.
- **A breakpoint or container token pointing at a variable.** CSS forbids
  `var()` inside a `@media` or `@container` condition; the browser drops the
  rule without complaint. Those two namespaces stay literal.

## Reference

- [`packages/ui/README.md`](../../packages/ui/README.md) — the package, and wiring up a new app
- [`packages/ui/src/tokens/README.md`](../../packages/ui/src/tokens/README.md) — the token layers and the linter
- [`packages/ui/src/components/primitives/README.md`](../../packages/ui/src/components/primitives/README.md) — component layout and `ui:add`
- [`apps/web/README.md`](../../apps/web/README.md) — scripts, layout, env vars
- [`apps/landing/README.md`](../../apps/landing/README.md) — the Next.js specifics
- Storybook: `pnpm --filter @kp-app/ui storybook` (port 6006)
