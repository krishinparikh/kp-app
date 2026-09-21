# @kp-app/ui

The shared front-end layer: design tokens, the stylesheet built on them, and the
React components written against it. Imported by every app that renders a page —
`web` today, `landing` next — so the two look the same without either owning the
answer.

```sh
ui/
├── src/
│   ├── index.ts          # the package's exports: every primitive, plus `cn`
│   ├── tokens/           # design tokens + the stylesheet apps import
│   └── components/
│       ├── primitives/   # shadcn/ui building blocks — Button, Dialog, Table
│       └── composites/   # pieces built out of primitives, still app-agnostic
├── testing/              # the Vitest DOM setup, shared with consuming apps
├── scripts/
│   ├── lint-tokens.ts    # the token-layering linter, run by every app
│   └── ui-add.ts         # `ui:add` — the shadcn CLI plus a reshape
└── .storybook/
```

Anything that knows about a feature belongs in the app, not here.

## Using it

Two imports, both from the app:

```css
/* apps/<name>/src/index.css */
@import '@kp-app/ui/styles.css';
```

```tsx
import { Button, Card, cn } from '@kp-app/ui'
```

The stylesheet is the whole setup — Tailwind, `tw-animate-css`, the Geist font,
the three token layers, and the base layer. An app adds only the
`@tailwindcss/vite` plugin (or its PostCSS equivalent) and needs no Tailwind
config of its own; v4 has none.

To wire up a new app:

1. Add `"@kp-app/ui": "workspace:*"` to its dependencies and run `pnpm install`
   from the repo root.
2. Import the stylesheet once, from the app's CSS entry.
3. Wrap the tree in `TooltipProvider` — every Radix tooltip needs one above it.
4. Point its `lint` script at `lint-tokens src`, so the app's own code is held
   to the same token rules.
5. Reuse the DOM stubs in its `vitest.setup.ts`:
   `import '@kp-app/ui/vitest-setup'`.

## Scripts

| Script                 | What it does                            |
| ---------------------- | --------------------------------------- |
| `pnpm lint`            | Oxlint, then the token linter           |
| `pnpm test`            | Vitest, once                            |
| `pnpm test:watch`      | Vitest, watching                        |
| `pnpm typecheck`       | Type-check without emitting             |
| `pnpm storybook`       | Storybook on http://localhost:6006      |
| `pnpm build-storybook` | Static Storybook to `storybook-static/` |
| `pnpm ui:add <name>`   | Add a shadcn component                  |

Run one with `pnpm --filter @kp-app/ui <script>`.

## No build step

Unlike [`contract/`](../contract/README.md), this package has no `build` and its
`exports` point straight at `src/`. Consumers compile it themselves.

That works because everything here is browser-bound: `web` and `landing` bundle
it, and the server never imports it. The rule in
[packages/README.md](../README.md) about emitting JavaScript applies to packages
the server reaches — this isn't one. Shipping source means no watcher to keep
running and no `dist/` to fall out of date.

The cost is that consumers compile TSX from `node_modules`, so two things have
to hold:

- **No `@/` alias in shipped source.** An app maps `@` to its own `src`, so
  `@/components/primitives/Button` would resolve into the app. Imports here are
  relative; `ui:add` rewrites the CLI's output to match.
- **`@source '../components'` in `tokens/index.css`.** Tailwind skips
  `node_modules` when scanning for class names, so the package has to name its
  own component folder for those classes to generate any CSS.

## More

- [src/tokens/README.md](src/tokens/README.md) — the two token layers, the
  theme, and what the linter enforces.
- [src/components/primitives/README.md](src/components/primitives/README.md) —
  the component layout, conventions, and `ui:add`.
