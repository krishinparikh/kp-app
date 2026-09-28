import { loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// The repo root .env is the single source of truth for credentials and ports,
// port here, rather than hardcoding one. An empty prefix loads every key.
const env = { ...loadEnv('test', '../../', ''), ...process.env }

/**
 * A database of its own, beside the dev one on the same server. These suites
 * truncate tables, and before this they did it in `kp`.
 *
 * DATABASE_URL_TEST overrides the lot — CI points at its own service with one
 * variable.
 */
const testDatabaseUrl =
  env.DATABASE_URL_TEST ??
  `postgresql://${env.POSTGRES_USER ?? 'kp'}:${env.POSTGRES_PASSWORD ?? 'kp'}` +
    `@localhost:${env.POSTGRES_PORT ?? '5432'}/${env.POSTGRES_DB ?? 'kp'}_test`

// Also on process.env because globalSetup runs in this process, not in a test
// worker, so both halves of the run agree on one database.
process.env.DATABASE_URL = testDatabaseUrl

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e.test.ts'],
    // Creates the database and migrates it, once for the whole run.
    globalSetup: ['./test/setup.ts'],
    // src/env.ts reads DATABASE_URL from process.env.
    env: { DATABASE_URL: testDatabaseUrl },
  },
})
