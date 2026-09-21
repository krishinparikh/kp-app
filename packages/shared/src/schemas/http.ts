import { z } from 'zod'

/**
 * The body NestJS puts on an HttpException. It comes in three shapes: a bare
 * message with no `error` key, a message plus status text, or a list of
 * messages when a validation pipe reports several issues.
 *
 * Loose, because a handler may attach extra keys. A client that rejects an
 * error body is worse than one that passes an unfamiliar field through.
 */
export const apiErrorBody = z.looseObject({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
})

/**
 * Flattens `message` to one line — the validation pipe returns a list.
 *
 * The one function in the package, and it lives here rather than in `types/`
 * because it is how you read this schema's output. Its parameter is inferred
 * inline rather than imported from `types/http.ts`, which would make the two
 * files import each other.
 */
export function apiErrorMessage(body: z.infer<typeof apiErrorBody>): string {
  return Array.isArray(body.message) ? body.message.join('; ') : body.message
}
