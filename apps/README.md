# Apps

Deployable things. Each one is a workspace package that nothing else imports —
if code needs to be shared between two of these, it belongs in `packages/`
instead.

```sh
apps/
├── server/     # NestJS API
├── web/        # React web app (Vite)
├── landing/    # Landing page (Next.js)
├── mcp-app/    # MCP app
└── mobile/     # Mobile app
```

`mcp-app/` and `mobile/` are still empty placeholders.

Everything that renders a page imports [`@kp-app/ui`](../packages/ui/README.md)
for its design tokens and components — `web` through the Tailwind Vite plugin,
`landing` through PostCSS. Neither declares a color of its own.

Run one on its own with `pnpm --filter <name> dev`, or the whole stack with
`make up` from the repo root.
