import { z } from 'zod'

export const healthPath = '/health'

export const healthStatuses = ['ok', 'degraded'] as const

export const healthResponse = z.object({
  status: z.enum(healthStatuses),
})

export type HealthResponse = z.infer<typeof healthResponse>
