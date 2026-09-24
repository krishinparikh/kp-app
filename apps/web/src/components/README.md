# components

Components shared by **several pages** of this app — header, nav, layout chrome.

```sh
components/
└── common/   # app-wide pieces — header, nav, layout chrome
```

A component used by only one page does **not** belong here. It lives in that
page's own folder, next to the `Page.tsx` that renders it:

```sh
app/home/
├── Page.tsx
└── components/StatCards.tsx
```

That keeps each page's parts beside the page, so they can be changed or deleted
with it, and makes moving something into `common/` a deliberate statement that a
second page needs it. See [`docs/guides/frontend.md`](../../../../docs/guides/frontend.md).

Anything a second app would also want lives in
[`@kp-app/ui`](../../../../packages/ui/README.md) instead: `primitives/` for the
shadcn building blocks, `composites/` for the things built out of them. Import
them by name:

```tsx
import { Button, Card } from '@kp-app/ui'
```

Colors, radii, and fonts come from the token layers in that package — never
from a literal. `pnpm lint` checks this folder too.
