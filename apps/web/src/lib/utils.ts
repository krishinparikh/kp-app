/**
 * Small pure helpers shared across the app's components. Anything that derives
 * or formats a value belongs here — nothing that renders, fetches or holds
 * state. Keep each one total: given any input of its type, it returns.
 */

/** Two initials for an avatar, from the first two words of a name. */
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
}

/** `spent` as a whole percent of `limit`, capped at 100 so a bar can't overrun. */
export function percentOf(spent: number, limit: number): number {
  if (limit <= 0) return 0
  return Math.min(100, Math.round((spent / limit) * 100))
}
