---
Guide: code-style
Description: How to write clean code — comments, and what to name a file, a schema and a constant.
---

# code-style

- Write minimal comments, only to explain things that are not implicitly understood

## Naming

| Kind               | Case               | Example                      |
| ------------------ | ------------------ | ---------------------------- |
| `.tsx` file        | PascalCase         | `TransactionTable.tsx`       |
| `.ts` file         | kebab-case         | `query-client.ts`            |
| `.py` file         | snake_case         | —                            |
| Component, type    | PascalCase         | `StatCards`, `CreateUser`    |
| Hook               | `use` + PascalCase | `useCreateUser`              |
| Function, variable | camelCase          | `percentOf`, `usersPath`     |
| Opaque value       | SCREAMING_SNAKE    | `UNIQUE_VIOLATION = '23505'` |

SCREAMING_SNAKE only for the opaque — a SQLSTATE, an injection token.
`usersPath` is data, not an incantation.

Three exceptions on filenames, each because something else owns the name:

- **Framework-owned** — `page.tsx`, `layout.tsx`, `preview.tsx`, generated
  `*.d.ts`. Renaming one breaks the build, silently.
- **NestJS artifacts** are dot-segmented: `users.controller.ts`,
  `db.module.ts`. Plain `.ts` in `apps/server` stays kebab (`setup-app.ts`).
- **Tests** carry their suite — `.unit.test`, `.int.test`, `.e2e.test` — because
  the suffix is what selects it. See [testing.md](testing.md).

A Zod schema is camelCase and its type the PascalCase of the same words. Never
hand-write the type; infer it, so the two can't disagree:

```ts
export const createUserBody = user.omit({ id: true })
export type CreateUser = z.infer<typeof createUserBody>
```
