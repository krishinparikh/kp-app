import type { z } from 'zod'

import type { healthResponse } from '../schemas/health.js'

export type HealthResponse = z.infer<typeof healthResponse>
