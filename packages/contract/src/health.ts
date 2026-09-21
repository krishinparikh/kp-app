import { z } from 'zod'

/**
 * Deliberately unversioned and outside the API prefix: load balancers and the
 * compose healthcheck want one stable URL that survives a version bump.
 */
export const healthResource = 'health'
export const healthPath = '/health'

export const healthStatuses = ['ok', 'degraded'] as const

export const healthResponse = z.object({
  status: z.enum(healthStatuses),
})

export type HealthResponse = z.infer<typeof healthResponse>
