import { existsSync } from 'node:fs'

import { defineConfig } from 'drizzle-kit'

import { normalizeDatabaseUrl } from './src/config/database-url.js'

// drizzle-kit runs outside Nest, so it loads the root .env itself. Inside the
// container the file is absent and compose supplies the real variables.
if (existsSync('../../.env')) {
  process.loadEnvFile('../../.env')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: normalizeDatabaseUrl(
      process.env.DATABASE_URL ??
        'postgresql://kp:kp@localhost:5432/kp',
    ),
  },
})
