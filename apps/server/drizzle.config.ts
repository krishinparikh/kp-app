import { defineConfig } from 'drizzle-kit'

import { env } from './src/env.js'

// Reuses the app's env client — .env loading, defaults and URL normalizing all
// live there, so drizzle-kit and the running server can't disagree.
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
})
