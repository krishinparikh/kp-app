import { existsSync } from 'node:fs'

import { z } from 'zod'

// The repo root .env is the single source of truth. It's absent inside the
// container, where compose injects these as real environment variables.
// loadEnvFile doesn't override what's already set, so a test's DATABASE_URL wins.
if (existsSync('../../.env')) {
  process.loadEnvFile('../../.env')
}

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  BACKEND_PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgresql://kp:kp@localhost:5432/kp')
    // postgres.js wants a plain postgresql:// URL, not postgresql+psycopg://.
    .transform((url) => url.replace(/^([a-z]+)\+[a-z0-9]+:\/\//i, '$1://')),
  // A JSON array of allowed origins.
  CORS_ORIGINS: z
    .string()
    .default('["http://localhost:5173"]')
    .transform((raw) => z.array(z.string()).parse(JSON.parse(raw))),
})

/** The one env client. Parsed at load, so a bad value kills boot, not a request. */
export const env = schema.parse(process.env)
