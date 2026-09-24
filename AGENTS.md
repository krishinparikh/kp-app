# KP App

A pnpm + Turborepo monorepo: a NestJS API, a React web app, a Next.js landing
page, and two shared packages. This file is an index — read the doc that covers
what you're about to change before you change it.

## Mandatory Rules

- **Brevity:** Make *everything* extremely concise and clear — your responses, documentation, comments, etc.
- **Naming:** PascalCase for `.tsx`, kebab-case for `.ts`, snake_case for `.py`.

- **Docs:** after any change, update whichever of these three still describe it —
  this file, the `docs/` page, the folder's `README.md`.

## docs/

| Doc                                                                   | Read it when                                                 | Status  |
| --------------------------------------------------------------------- | ------------------------------------------------------------ | ------- |
| [guides/frontend.md](docs/guides/frontend.md)                         | Building **any** UI — a page, a component, a style           | Written |
| [guides/backend.md](docs/guides/backend.md)                           | Touching the **API** — an endpoint, a schema, a table        | Written |
| [guides/update-harness.md](docs/guides/update-harness.md)             | Changing any doc, guide, or agent config — **read first**    | Written |
| [architecture/high-level.md](docs/architecture/high-level.md)         | You need the shape of the system before placing something    | Written |
| [architecture/file-structure.md](docs/architecture/file-structure.md) | You're unsure which package or folder a file belongs in      | Written |
| [architecture/environments.md](docs/architecture/environments.md)     | Working with env vars, ports, or local vs Docker vs deployed | Written |
| [architecture/ci.md](docs/architecture/ci.md)                         | A pipeline is failing, or you're adding a check              | Empty   |
| [architecture/db.md](docs/architecture/db.md)                         | You need the data model without reading `schema.ts`          | Empty   |
| [product/prd.md](docs/product/prd.md)                                 | You need to know what the product does, or what's in scope   | Empty   |
| [product/user-stories.md](docs/product/user-stories.md)               | You need a feature's expected behaviour from the user's side | Empty   |
| [workflows/sdlc.md](docs/workflows/sdlc.md)                           | You need the branch, review and release process              | Empty   |
| [workflows/zero-to-one.md](docs/workflows/zero-to-one.md)             | Standing up something new from scratch                       | Empty   |
| [templates/](docs/templates/)                                         | Creating a new PRD, README or AGENTS file                    | Written |

**Empty means empty.** Those files are placeholders with no content yet. Don't
read them expecting answers, and don't infer that a guide doesn't exist because
its page is blank — fall back to the READMEs below, then the code.

## Folder READMEs

The detail lives next to the code. The guides above link into these; go straight
to one when you already know where you're working.

| README                                                                                             | Covers                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [apps/server/README.md](apps/server/README.md)                                                     | NestJS + Drizzle: scripts, layout, env, migrations     |
| [apps/web/README.md](apps/web/README.md)                                                           | The React app: scripts, routing, layout                |
| [apps/landing/README.md](apps/landing/README.md)                                                   | The Next.js landing page and its RSC constraints       |
| [packages/README.md](packages/README.md)                                                           | The runtime boundary, and why one package builds       |
| [packages/shared/README.md](packages/shared/README.md)                                             | The API contract — Zod schemas, types, route constants |
| [packages/ui/README.md](packages/ui/README.md)                                                     | The shared front-end package and how apps consume it   |
| [packages/ui/src/tokens/README.md](packages/ui/src/tokens/README.md)                               | The design-token layers and what the linter enforces   |
| [packages/ui/src/components/primitives/README.md](packages/ui/src/components/primitives/README.md) | Component layout, conventions, and `ui:add`            |
| [apps/web/src/components/README.md](apps/web/src/components/README.md)                             | Where an app component goes                            |
