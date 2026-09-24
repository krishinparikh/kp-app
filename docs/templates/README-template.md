<!--
Template for a folder README — the most specific documentation there is, and
the first thing an agent reads before touching the code beside it.

Fill in the sections that apply and delete the rest, along with every comment
and <placeholder>. A three-line README that is true beats a complete one that
drifts.

What belongs here vs. elsewhere:
  README.md       what this folder is, how it's laid out, what will surprise you
  docs/guides/     how to build things, across folders
  code comments   why this line is the way it is
Never repeat a rule in two places. Link instead.
-->

# <folder-name>

<!-- Title is the folder's own name, lowercase (`tokens`, `primitives`), or the
     package name for a package (`@kp-app/ui`). Not a description. -->

<One or two sentences: what this folder holds, and why it exists as its own
thing.>

<State the boundary in one line — what does NOT belong here, and where it goes
instead. This is the sentence that stops the folder sprawling:>
Anything that <crosses the boundary> lives in [`<other-place>`](path) instead.

<!-- ── Running it. Packages only; delete for a plain folder. ─────────────── -->

```bash
pnpm install              # from the repo root — this is a workspace package
pnpm --filter <name> dev
```

| Script           | What it does                |
| ---------------- | --------------------------- |
| `pnpm dev`       | <Dev server on http://…>    |
| `pnpm build`     | <…>                         |
| `pnpm lint`      | <…>                         |
| `pnpm test`      | <…>                         |
| `pnpm typecheck` | Type-check without emitting |

## Layout

<!-- Only the files a reader needs to find their way. Annotate what isn't
     obvious from the name; leave the obvious ones bare. -->

```sh
<folder>/
├── <entry>.ts       # <what it does>
├── <folder>/        # <what's in it>
└── <folder>/
```

<One or two sentences on the organizing idea — why it's split this way, and
what a new file's folder depends on.>

## <Topic section>

<!-- One per thing worth explaining: a workflow ("Adding a component"), a
     constraint ("No build step"), a decision and its reason ("Why schemas and
     not interfaces"). Heading says the thing, not the category. -->

## Notes

<!-- The gotchas: what will surprise someone, cost an hour, or fail silently.
     Lead each with a bold clause so the list scans. Not a changelog, and not a
     restatement of what the code plainly says. -->

- **<The surprising thing.>** <Why it's that way, and what happens if you get it
  wrong.>
- **<…>**

## More

- [`<path>/README.md`](<path>/README.md) — <what it covers>
- [`docs/guides/<name>.md`](../../docs/guides/<name>.md) — <when to read it>
