/**
 * Deliberately unversioned and outside the API prefix: load balancers and the
 * compose healthcheck want one stable URL that survives a version bump.
 */
export const healthResource = 'health'
export const healthPath = '/health'

export const healthStatuses = ['ok', 'degraded'] as const
