import { apiPrefix } from './http.js'

/** What the server mounts the controller on. */
export const usersResource = 'users'

/** What a client requests — the mounted resource, prefix included. */
export const usersPath = `${apiPrefix}/${usersResource}`
