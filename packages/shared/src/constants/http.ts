/**
 * Where the versioned API is mounted. No `/api` segment — the API answers on
 * its own host, so this is only what `enableVersioning` adds in the server's
 * `setup-app.ts`. Clients get the finished path from the `*Path` exports, so
 * neither side hardcodes it.
 */
export const apiPrefix = '/v1'
