/**
 * Where the versioned API is mounted. The server builds this from
 * `setGlobalPrefix` + `enableVersioning`; clients get the finished path from
 * the `*Path` exports, so neither side hardcodes it.
 */
export const apiPrefix = '/api/v1'
