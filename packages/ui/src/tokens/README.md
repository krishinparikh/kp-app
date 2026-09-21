# tokens

Design tokens, in two layers plus a theme. Modelled on
[Figma's primitive/semantic split](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles).

```sh
tokens/
├── index.css        # the stylesheet every app imports — Tailwind, the fonts,
│                    #   the three files below, and the base layer
├── primitives.css   # raw values, referencing nothing
├── semantics.css    # roles, each pointing at one primitive
├── theme.css        # which tokens become utility classes — and which of
│                    #   Tailwind's own defaults survive (none, by default)
├── tokens.ts        # parses the two token files for the Storybook page
└── Tokens.stories.tsx
```

`index.css` imports them in that order and is what an app reaches for:

```css
@import '@kp-app/ui/styles.css';
```

See them rendered under **Design Tokens → Reference** in Storybook
(`pnpm --filter @kp-app/ui storybook`).

It also carries one line an app-local stylesheet wouldn't need:

```css
@source '../components';
```

Tailwind never scans `node_modules` on its own, and that is how a consuming app
resolves this package. Without it, a class used only inside a primitive would
generate no CSS.

## The two layers

| Layer     | Lives in         | Example                                  | Named for         | Who may read it      |
| --------- | ---------------- | ---------------------------------------- | ----------------- | -------------------- |
| Primitive | `primitives.css` | `--neutral-500: oklch(0.556 0 0)`        | what it **is**    | `semantics.css` only |
| Semantic  | `semantics.css`  | `--muted-foreground: var(--neutral-500)` | what it's **for** | `theme.css` only     |

A component never names a color. It writes `text-muted-foreground`, which
resolves down through both.

**Every scale works this way**, not just color — type, spacing, elevation and
motion each have a ramp in `primitives.css` and roles in `semantics.css`:

```
--font-size-2: 0.875rem     (primitive: a step on the ramp)
  └─ --text-body            (semantic: the role that step plays)
       └─ --text-sm         (theme: the class Tailwind generates)
```

So `text-sm` renders whatever `--text-body` points at. Re-point the role in
`theme.css`, change what the role _is_ in `semantics.css`, or adjust the ramp
itself in `primitives.css`.

The roles are ours to name, unlike the color roles, which are shadcn's:

| Scale     | Roles                                                                             |
| --------- | --------------------------------------------------------------------------------- |
| Type      | `caption` `body` `body-lead` `title-sm` `title` `title-lg` `display-sm` `display` |
| Weight    | `body` `emphasis` `heading` `strong`                                              |
| Leading   | `flush` `headline` `ui` `prose` `airy`                                            |
| Tracking  | `headline` `body` `label` `caps`                                                  |
| Elevation | `hairline` `resting` `raised` `overlay` `popover` `modal`                         |
| Blur      | `scrim` `veil` `frost` `heavy`                                                    |
| Motion    | `duration` `easing` `spinner` `skeleton` `attention` `disclosure-open/close`      |

Each type role carries its line height as a matching `-leading` role, so a size
and its leading can't drift apart.

Only colors have a `.dark` block. The other scales don't change with the theme,
so they're declared once.

## The one exception: breakpoints and containers

`--breakpoint-*` and `--container-*` keep literal values in `theme.css`. This is
forced by CSS, not a design choice: those values land inside `@media` and
`@container` conditions, and **a query condition cannot read a variable**.
Tailwind copies the value in verbatim, so indirecting one produces

```css
@media (width >= var(--screen-tablet)) { … }   /* invalid — dropped entirely */
```

and a container variant like `@sm:flex` emits no rule at all. Both fail
silently, in the browser, with no build error. The linter enforces that these
two namespaces stay literal.

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

Every entry in `theme.css` reads a semantic token — the file holds no values of
its own, only the decision about which roles become classes and under what name.
The two exceptions are described above.

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

`scripts/lint-tokens.ts` runs as part of every app's `pnpm lint` — the package
exposes it as a `lint-tokens` binary, so each app checks its own source against
these files — and closes the one gap structure can't — arbitrary values — plus drift inside the token files:

- a primitive that references another token
- a semantic token holding a literal, a `calc()`, or a pointer at another
  semantic token
- any entry in `theme.css` reaching a primitive, holding a literal, or naming a
  semantic token that doesn't exist — every namespace, not just color and radius
- a `--breakpoint-*` or `--container-*` entry that _does_ reference a token,
  which would silently break the query it ends up in
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

| Goal                                 | Edit                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Adjust a shade                       | `primitives.css`                                                                             |
| Re-point a role at a different shade | `semantics.css`                                                                              |
| Add a new color role                 | `semantics.css`: declare in `:root` + `.dark`, then add one `--color-*` line to `theme.css`  |
| Change the corner radius             | `--radius-base` in `primitives.css`                                                          |
| Make `text-sm` bigger everywhere     | `--text-body` in `semantics.css`, or `--font-size-2` to move the ramp step itself            |
| Change a shadow                      | `--box-shadow-N` in `primitives.css`                                                         |
| Add a new size step                  | `--font-size-N` + `--font-leading-N`, a role in `semantics.css`, a `--text-*` in `theme.css` |

Don't rename semantic tokens. Those names are shadcn's, and every component
added with `pnpm --filter @kp-app/ui ui:add` expects exactly them.

## Keyframes

`theme.css` ends with a handful of `@keyframes` blocks, outside `@theme`. They
have to be there.

Tailwind emits a keyframe only when it can read the animation name out of an
`--animate-*` value. Ours say `var(--motion-spinner)`, so it can't — and
`--*: initial` has already deleted the ones Tailwind and `tw-animate-css` ship.
Declared at the top level they are always emitted, which is what makes
`animate-spin`, `animate-pulse` and the accordion actually move.
