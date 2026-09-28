import { z } from 'zod'

const schema = z.object({
  VITE_API_URL: z.url().default('http://localhost:8000'),
})

/** The one env client. Parsed at load, so a bad value fails here, not later. */
export const env = schema.parse(import.meta.env)
