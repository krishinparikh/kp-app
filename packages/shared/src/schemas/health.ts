import { z } from 'zod'

import { healthStatuses } from '../constants/health.js'

export const healthResponse = z.object({
  status: z.enum(healthStatuses),
})
