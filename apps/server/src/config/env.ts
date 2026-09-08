import { z } from 'zod'

import { normalizeDatabaseUrl } from './database-url.js'

// CORS_ORIGINS is a JSON array in .env; a comma-separated list also works.
const parseOrigins = (raw: string): string[] => {
  const trimmed = raw.trim()
  if (trimmed.startsWith('[')) {
    return z.array(z.string()).parse(JSON.parse(trimmed))
  }
  return trimmed
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  BACKEND_PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgresql://finance:finance@localhost:5432/finance')
    .transform(normalizeDatabaseUrl),
  CORS_ORIGINS: z
    .string()
    .default('["http://localhost:5173"]')
    .transform(parseOrigins),
})

export type Env = z.infer<typeof envSchema>

// Spread the raw values back in so the rest of process.env stays reachable
// through ConfigService; the parsed keys overwrite their raw counterparts.
export const validateEnv = (raw: Record<string, unknown>) => ({
  ...raw,
  ...envSchema.parse(raw),
})
