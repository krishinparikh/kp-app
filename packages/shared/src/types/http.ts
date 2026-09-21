import type { z } from 'zod'

import type { apiErrorBody } from '../schemas/http.js'

export type ApiErrorBody = z.infer<typeof apiErrorBody>
