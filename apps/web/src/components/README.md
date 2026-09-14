# components

UI components for the web app.

```sh
components/
└── primitives/   # shadcn/ui building blocks — see primitives/README.md
```

Colors, radii, and fonts come from the token layers in
[src/styles/](../styles/README.md) — never from a literal.

`primitives/` holds unopinionated, app-agnostic pieces (Button, Input, Dialog).
Anything that knows about a feature — a transaction row, an account picker —
belongs in a sibling folder here, not in `primitives/`.
