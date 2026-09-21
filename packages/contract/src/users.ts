import { z } from 'zod'

import { apiPrefix } from './http.js'

/** What the server mounts the controller on. */
export const usersResource = 'users'

/** What a client requests — the mounted resource, prefix included. */
export const usersPath = `${apiPrefix}/${usersResource}`

/** Path params are validated too — a bad id is a 400, not a failed lookup. */
export const userIdParam = z.uuid()

export const user = z.object({
  id: z.uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.email(),
  // Calendar dates, not instants — 'YYYY-MM-DD', no time and no timezone.
  dob: z.iso.date(),
})

export const userList = z.array(user)

/** The server assigns the id, so a client never sends one. */
export const createUserBody = user.omit({ id: true })

/** Every field optional — PATCH updates whatever it's given. */
export const updateUserBody = createUserBody.partial()

export type User = z.infer<typeof user>
export type CreateUser = z.infer<typeof createUserBody>
export type UpdateUser = z.infer<typeof updateUserBody>
