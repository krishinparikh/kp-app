import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { getTableName, is, sql, Table } from 'drizzle-orm'
import postgres from 'postgres'

import type { Database } from './../src/db/db.module.js'
import * as schema from './../src/db/schema.js'

// Set by vitest.config.e2e.ts, which owns the name of the test database.
const testDatabaseUrl = required('DATABASE_URL')
const databaseName = new URL(testDatabaseUrl).pathname.slice(1)

/**
 * Vitest's `globalSetup`: once per `pnpm test:e2e`, not once per file. Creates
 * the test database if it's missing, then brings it to the latest migration.
 *
 * Deliberately not a compose init script — those run only when the data volume
 * is first created, so an existing volume would skip it and the failure would
 * surface as a missing table.
 */
export default async function setup(): Promise<void> {
  // CREATE DATABASE can't run from inside the database it creates.
  const admin = postgres(urlFor('postgres'), { max: 1, onnotice: quiet })
  try {
    const [found] = await admin`
      select 1 from pg_database where datname = ${databaseName}`
    // An identifier can't be parameterised. The name is ours, not input.
    if (!found) await admin.unsafe(`create database "${databaseName}"`)
  } finally {
    await admin.end()
  }

  const client = postgres(testDatabaseUrl, { max: 1, onnotice: quiet })
  try {
    await migrate(drizzle(client), { migrationsFolder: './drizzle' })
  } finally {
    await client.end()
  }
}

const tables = Object.values(schema)
  .filter((exported) => is(exported, Table))
  .map((table) => `"${getTableName(table)}"`)

/**
 * Empties every table the schema declares, so adding one needs no new cleanup.
 * CASCADE because a future foreign key would otherwise block the truncate.
 */
export const truncateAll = (db: Database) =>
  db.execute(sql.raw(`truncate table ${tables.join(', ')} cascade`))

/**
 * Swallows Postgres NOTICEs. The migrator's `create table if not exists`
 * emits one on every run, and a clean run should print nothing — otherwise a
 * real error doesn't stand out.
 */
const quiet = () => {}

/** The same connection, pointed at a different database on that server. */
function urlFor(name: string): string {
  const url = new URL(testDatabaseUrl)
  url.pathname = `/${name}`
  return url.href
}

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is unset — run this through \`pnpm test:e2e\``)
  }
  return value
}
