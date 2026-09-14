# styles

Design tokens, in two layers plus a theme. Modelled on
[Figma's primitive/semantic split](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles).

```sh
styles/
├── primitives.css   # raw values, referencing nothing
├── semantics.css    # roles, each pointing at one primitive
├── theme.css        # which tokens become utility classes — and which of
│                    #   Tailwind's own defaults survive (none, by default)
├── tokens.ts        # parses the two token files for the Storybook page
└── Tokens.stories.tsx
```

`src/index.css` imports them in that order. See them rendered under
**Design Tokens → Reference** in Storybook (`pnpm storybook`).

## The two layers

| Layer     | Lives in         | Example                                  | Named for         | Who may read it      |
| --------- | ---------------- | ---------------------------------------- | ----------------- | -------------------- |
| Primitive | `primitives.css` | `--neutral-500: oklch(0.556 0 0)`        | what it **is**    | `semantics.css` only |
| Semantic  | `semantics.css`  | `--muted-foreground: var(--neutral-500)` | what it's **for** | `theme.css` only     |

A component never names a color. It writes `text-muted-foreground`, which
resolves down through both.

`theme.css` is not a third layer of tokens — it holds no color decisions, only
the line that exposes each one:

```css
@theme inline {
  --color-muted-foreground: var(--muted-foreground);
}
```

That alias is unavoidable. Tailwind only makes classes from names in its own
`--color-*` namespace, while shadcn components read the bare names directly —
`Button.tsx` uses `color-mix(in oklch, var(--secondary), var(--foreground) 5%)`
for its hover state. Both spellings have to exist.

## Everything a component can use is in theme.css

`theme.css` opens with:

```css
@theme inline {
  --*: initial;
  ...
}
```

That deletes **every** value Tailwind ships — not just the color palette, but
the type scale, weights, radii, shadows, breakpoints, easings, the lot. Nothing
exists unless theme.css declares it, so the file is a complete, readable
inventory of what the app is allowed to use.

The set is deliberately narrower than Tailwind's default:

|              | Tailwind ships         | We declare                         |
| ------------ | ---------------------- | ---------------------------------- |
| Colors       | 22 palettes × 11 steps | semantic roles only                |
| Text sizes   | `xs`–`9xl`             | `xs`–`4xl`                         |
| Font weights | 9                      | 4 — normal, medium, semibold, bold |
| Shadows      | `2xs`–`2xl`, `inner`   | `2xs`–`xl`                         |
| Containers   | `3xs`–`7xl`            | `xs`–`5xl`                         |

So `text-9xl`, `font-thin`, `shadow-inner` and `bg-red-500` all generate no CSS.
Structural utilities (`flex`, `items-center`, `absolute`) aren't theme values and
are unaffected — they carry no design decision.

Colors and radii read semantic tokens. The other scales are plain values in
`theme.css`: they carry no role and don't swap between light and dark, so
routing them through a semantic layer would only forward.

## Why components can't cheat

Most of the boundary isn't enforced by a linter — it's enforced by the fact that
the shortcut doesn't exist.

Tailwind only generates a utility class for variables declared inside `@theme`.
Primitives and semantics live in plain `:root` blocks, so **no class maps to
them**; and `--*: initial` removes everything Tailwind would otherwise have
provided. The result:

```
bg-background          ->  works
text-muted-foreground  ->  works
bg-neutral-500         ->  nothing. Primitives make no classes.
text-gray-600          ->  nothing. The default palette is deleted.
text-9xl / font-thin   ->  nothing. Not in theme.css.
```

Because an undeclared class fails silently in the browser rather than at build
time, the linter names them for you — see below.

`@theme inline` (rather than plain `@theme`) inlines the variable reference into
each utility, which is what lets the `.dark` block in `semantics.css` swap
values at runtime.

## What the linter adds

`scripts/lint-tokens.ts` runs as part of `pnpm lint` and closes the one gap
structure can't — arbitrary values — plus drift inside the token files:

- a primitive that references another token
- a semantic token holding a literal, a `calc()`, or a pointer at another
  semantic token
- a `--color-*` or `--radius-*` entry in `theme.css` reaching a primitive,
  holding a literal, or naming a semantic token that doesn't exist
- `theme.css` losing its `--*: initial` line, which would let every Tailwind
  default back in
- a component using a class the theme deletes (`bg-red-500`, `text-9xl`,
  `font-thin`, bare `rounded`). That list is computed by diffing Tailwind's own
  default theme against `theme.css`, so it stays right as the theme changes
- a component writing a raw color (`bg-[#fff]`) or reading a primitive
  (`var(--neutral-500)`)
- a bare `bg-[var(--muted)]`, which is just a long way to write `bg-muted`
- a primitive whose name collides with a theme variable (the names are
  unprefixed, and both land in `:root`)

Composing semantic tokens inline **is** allowed, because it consumes nothing but
semantic tokens — shadcn does this for hover states:

```
hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]
```

Files in this folder are exempt: they are the token layer itself.

## Changing things

| Goal                                 | Edit                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Adjust a shade                       | `primitives.css`                                                                            |
| Re-point a role at a different shade | `semantics.css`                                                                             |
| Add a new color role                 | `semantics.css`: declare in `:root` + `.dark`, then add one `--color-*` line to `theme.css` |
| Change the corner radius             | `--radius-base` in `primitives.css`                                                         |

Don't rename semantic tokens. Those names are shadcn's, and every component
added with `pnpm ui:add` expects exactly them.

## Not layered yet

Type and spacing still use Tailwind's own scales (`text-sm`, `p-4`) and sit in
the `@theme` block as plain values. The same split extends to them when it's
worth it — add the ramp to `primitives.css`, alias it in `semantics.css`, and
widen the `--(color|radius)-` check in `scripts/lint-tokens.ts`.
