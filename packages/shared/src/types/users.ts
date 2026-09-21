import type { z } from 'zod'

import type { createUserBody, updateUserBody, user } from '../schemas/users.js'

export type User = z.infer<typeof user>
export type CreateUser = z.infer<typeof createUserBody>
export type UpdateUser = z.infer<typeof updateUserBody>
