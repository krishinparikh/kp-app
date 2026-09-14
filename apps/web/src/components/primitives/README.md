# primitives

[shadcn/ui](https://ui.shadcn.com) components, vendored into this repo. They are
ours to edit — there is no upstream package to upgrade.

Every component is a folder holding four files:

```sh
primitives/
├── index.ts              # barrel re-exporting every folder below
└── Button/
    ├── Button.tsx          # the component
    ├── Button.stories.tsx  # Storybook stories
    ├── Button.test.tsx     # Vitest + Testing Library
    └── index.ts            # re-exports Button.tsx
```

Import from the barrel:

```tsx
import { Button } from '@/components/primitives'
```

## Adding a component

```bash
pnpm ui:add select checkbox
```

`scripts/ui-add.ts` runs the shadcn CLI and then reshapes its output. The CLI
writes one flat kebab-case file (`primitives/select.tsx`); the script moves it to
`primitives/Select/Select.tsx`, adds the `index.ts` barrel plus story and test
stubs, rewrites the cross-component imports shadcn generates, and regenerates
the root barrel.

The stubs are placeholders. Fill them in, then run `pnpm format` — shadcn's
output uses its own style.

Browse the catalogue at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

## Conventions

- **Folder and component files are PascalCase**, matching the repo standard for
  `.tsx`. Only `index.ts` is lowercase.
- **Stories are grouped under `Primitives/`** in the Storybook sidebar
  (`title: 'Primitives/Button'`).
- **Colors come from semantic tokens only.** `pnpm lint` fails on a raw color
  or a direct primitive reference.
- **Tests assert behaviour, not classes.** Query by role, click with
  `@testing-library/user-event`, and leave Tailwind output alone — it changes
  whenever the design tokens do.
- **`react/only-export-components` is off here** (see `.oxlintrc.json`). Every
  shadcn component exports a `cva` variants object next to the component, which
  the fast-refresh rule can't see past.

## Design tokens

Components never name a color. They use classes like `bg-primary` and
`text-muted-foreground`, which resolve through two token layers in
`src/styles/` — primitives hold the raw values, semantics name the roles.

Tailwind's defaults are deleted wholesale — not just the palette, but the parts
of the type, shadow and radius scales the theme doesn't declare. `bg-red-500`,
`text-9xl` and `font-thin` generate no CSS. If you need something that doesn't
exist yet, add it to `theme.css` (a semantic token first, for colors) rather
than reaching for a literal. See [src/styles/README.md](../../styles/README.md).

The preset is `radix-nova` — Radix primitives, Lucide icons, Geist.
`components.json` records the settings the CLI reuses on each `ui:add`.

Dark mode keys off a `.dark` ancestor class. Storybook has a toolbar switch for
it; the app itself doesn't toggle it yet.
