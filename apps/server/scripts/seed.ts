import { existsSync } from 'node:fs'

import { createUserBody } from '@kp-app/shared'
import postgres from 'postgres'

/**
 * Fills the dev database so the app has something to render on a fresh clone.
 *
 * Deliberately NOT for tests: they build what they assert on and truncate
 * between cases, so a seeded row would break any assertion that counts. See
 * docs/guides/testing.md.
 *
 * Self-contained by necessity — node runs this .ts file directly, and it can't
 * resolve the `.js` specifiers the rest of the app compiles with. So the table
 * and column names are written out here rather than imported from schema.ts.
 * A rename there fails this script loudly on its next run.
 */

// Same as drizzle.config.ts: this runs outside Nest, so it loads the root .env
// itself. Inside the container the file is absent and compose supplies them.
if (existsSync('../../.env')) {
  process.loadEnvFile('../../.env')
}

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://kp:kp@localhost:5432/kp'

if (new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error(`Refusing to seed a test database: ${databaseUrl}`)
}

// Parsed with the contract, so seed data can't drift from what the API accepts.
const people = [
  ['Ada', 'Lovelace', 'ada@example.com', '1815-12-10'],
  ['Grace', 'Hopper', 'grace@example.com', '1906-12-09'],
  ['Alan', 'Turing', 'alan@example.com', '1912-06-23'],
  ['Katherine', 'Johnson', 'katherine@example.com', '1918-08-26'],
].map(([firstName, lastName, email, dob]) =>
  createUserBody.parse({ firstName, lastName, email, dob }),
)

const client = postgres(databaseUrl, { max: 1 })
try {
  const rows = people.map((person) => ({
    first_name: person.firstName,
    last_name: person.lastName,
    email: person.email,
    dob: person.dob,
  }))

  // Idempotent: email is unique, so a rerun inserts nothing.
  const inserted = await client`
    insert into users ${client(rows)}
    on conflict (email) do nothing
    returning email`

  console.log(
    `Seeded ${inserted.length} of ${people.length} users` +
      ` (${people.length - inserted.length} already present).`,
  )
} finally {
  await client.end()
}
