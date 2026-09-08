# Apps

Deployable things. Each one is a workspace package that nothing else imports —
if code needs to be shared between two of these, it belongs in `packages/`
instead.

```sh
apps/
├── server/     # NestJS API
├── web/        # React web app
├── landing/    # Landing page
├── mcp-app/    # MCP app
└── mobile/     # Mobile app
```

Only `server/` and `web/` exist so far; the rest are empty placeholders.

Run one on its own with `pnpm --filter <name> dev`, or the whole stack with
`make up` from the repo root.
