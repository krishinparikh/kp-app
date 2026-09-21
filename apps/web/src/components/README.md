# components

Components that belong to this app alone.

```sh
components/
└── common/   # app-wide pieces — header, nav, layout chrome
```

Anything a second app would also want lives in
[`@kp-app/ui`](../../../../packages/ui/README.md) instead: `primitives/` for the
shadcn building blocks, `composites/` for the things built out of them. Import
them by name:

```tsx
import { Button, Card } from '@kp-app/ui'
```

Colors, radii, and fonts come from the token layers in that package — never
from a literal. `pnpm lint` checks this folder too.
