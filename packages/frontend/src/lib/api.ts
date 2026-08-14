import createClient from 'openapi-fetch'
import type { paths } from './api-types.ts'

/**
 * Typed client for the FastAPI backend. Paths, params, request bodies and
 * responses are all inferred from `api-types.ts`, so a backend change surfaces
 * here as a type error after `pnpm gen:api`.
 *
 *   const { data, error } = await api.GET('/health')
 *
 * `data` and `error` are narrowed by the response status — there is no throw to
 * catch, so check `error` before using `data`.
 */
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
})
