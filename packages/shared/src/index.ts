// The API contract both apps share, in three layers:
//
//   constants/  resource names and paths — no dependencies
//   schemas/    the Zod schemas, which read the constants
//   types/      the types inferred from those schemas
//
// Schemas describe what crosses the wire, so they use the JSON shape — a
// timestamp is `z.string()`, never `z.date()`.
export * from './constants/index.js'
export * from './schemas/index.js'
export type * from './types/index.js'
