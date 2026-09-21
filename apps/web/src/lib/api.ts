import type { z } from 'zod'
import { apiErrorBody, apiErrorMessage } from '@kp-app/contract'
import type { ApiErrorBody } from '@kp-app/contract'

const baseUrl = import.meta.env.VITE_API_URL ?? ''

/**
 * A non-2xx response. `body` is the server's error payload when it sent one
 * the contract recognises, and undefined when it didn't — a proxy's HTML 502
 * page, say.
 */
export class ApiError extends Error {
  // Declared then assigned: erasableSyntaxOnly bans parameter properties.
  status: number
  body: ApiErrorBody | undefined

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export type RequestOptions = {
  method?: string
  /** Serialised as JSON. */
  body?: unknown
  signal?: AbortSignal
}

/**
 * Calls the API and parses the response against a contract schema.
 *
 *   const health = await apiRequest(healthPath, healthResponse)
 *
 * The parse is the point. The contract is hand-written, so this is what turns
 * a server that has drifted from it into an error at the boundary rather than
 * a confusing failure somewhere downstream.
 */
export async function apiRequest<S extends z.ZodType>(
  path: string,
  schema: S,
  options: RequestOptions = {},
): Promise<z.output<S>> {
  const { method = 'GET', body, signal } = options
  const hasBody = body !== undefined

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    signal,
    // Matches the server's enableCors({ credentials: true }).
    credentials: 'include',
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  })

  const payload = await readJson(response)

  if (!response.ok) {
    const parsed = apiErrorBody.safeParse(payload)
    throw new ApiError(
      response.status,
      parsed.success ? apiErrorMessage(parsed.data) : response.statusText,
      parsed.data,
    )
  }

  return schema.parse(payload)
}

/** undefined rather than a throw for an empty or non-JSON body. */
async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
