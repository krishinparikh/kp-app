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

`src/index.ts` re-exports the barrel, so an app imports by package name:

```tsx
import { Button } from '@kp-app/ui'
```

Inside the package, one primitive reaches another by relative path
(`../Button/index.ts`). The `@/` alias must not appear in any shipped file: a
consuming app maps `@` to its own `src`, so the import would resolve into the
app and break.

## What's here

| Group    | Components                                                                    |
| -------- | ----------------------------------------------------------------------------- |
| Forms    | `Button` `Input` `Textarea` `Label` `Checkbox` `RadioGroup` `Select` `Switch` |
| Layout   | `Card` `Separator` `Tabs` `Accordion` `Table`                                 |
| Content  | `Avatar` `Badge` `Alert` `Skeleton`                                           |
| Overlays | `Dialog` `AlertDialog` `Sheet` `Popover` `DropdownMenu` `Tooltip`             |

Two of these need setup above them:

- **`TooltipProvider`** wraps each consuming app (`apps/web/src/main.tsx`) and
  the Storybook canvas (`.storybook/preview.tsx`). A `Tooltip` without one
  throws. Tests wrap their own, so they don't depend on either.
- **`AlertDialog`** can't be dismissed by clicking outside. Use it for
  destructive or irreversible choices; use `Dialog` for everything else.

## Adding a component

```bash
pnpm --filter @kp-app/ui ui:add select checkbox
```

`scripts/ui-add.ts` runs the shadcn CLI and then reshapes its output. The CLI
writes one flat kebab-case file (`primitives/select.tsx`); the script moves it to
`primitives/Select/Select.tsx`, adds the `index.ts` barrel plus story and test
stubs, and regenerates the root barrel.

It also rewrites the two aliases the CLI emits, because neither survives being
imported from another package: `@/components/primitives/<kebab>` becomes a
relative `../<Name>/index.ts`, and `@/lib/utils` becomes the `cn` package every
component here already uses. `components.json` still declares those aliases —
the CLI needs them to decide where to write — and `tsconfig.json` still maps
`@/*` so the CLI can resolve them. Neither reaches the shipped source.

The stubs are placeholders. Fill them in, then run `pnpm format` — shadcn's
output uses its own style.

Browse the catalogue at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

## Conventions

- **Folder and component files are PascalCase**, matching the repo standard for
  `.tsx`. Only `index.ts` is lowercase.
- **Stories are grouped under `Primitives/`** in the Storybook sidebar
  (`title: 'Primitives/Button'`).
- **Colors come from semantic tokens only.** `pnpm lint` fails on a raw color
  or a direct primitive reference — here and in every app that imports this
  package.
- **Tests assert behaviour, not classes.** Query by role, click with
  `@testing-library/user-event`, and leave Tailwind output alone — it changes
  whenever the design tokens do.
- **Overlays open for real in tests.** `testing/vitest-setup.ts` stubs the browser APIs
  Radix needs and jsdom lacks (`ResizeObserver`, pointer capture,
  `scrollIntoView`, `matchMedia`), so a dialog or menu can be opened and
  asserted on rather than mocked. Portalled content only exists once open, so
  reach for `findByRole` over `getByRole`.
- **`react/only-export-components` is off here** (see `.oxlintrc.json`). Every
  shadcn component exports a `cva` variants object next to the component, which
  the fast-refresh rule can't see past.

## Design tokens

Components never name a color. They use classes like `bg-primary` and
`text-muted-foreground`, which resolve through two token layers in
`src/tokens/` in `@kp-app/ui` — primitives hold the raw values, semantics name the roles.

Tailwind's defaults are deleted wholesale — not just the palette, but the parts
of the type, shadow and radius scales the theme doesn't declare. `bg-red-500`,
`text-9xl` and `font-thin` generate no CSS. If you need something that doesn't
exist yet, add it to `theme.css` (a semantic token first, for colors) rather
than reaching for a literal. See [../../tokens/README.md](../../tokens/README.md).

The preset is `radix-nova` — Radix primitives, Lucide icons, Geist.
`components.json` records the settings the CLI reuses on each `ui:add`.

Dark mode keys off a `.dark` ancestor class. Storybook has a toolbar switch for
it; the app itself doesn't toggle it yet.
