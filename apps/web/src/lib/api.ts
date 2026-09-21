import axios, { type AxiosResponse } from 'axios'
import type { z } from 'zod'

/**
 * Single axios instance. Requests are cross-origin — the web app runs on 5173
 * and the API on 8000 — so `baseURL` points at VITE_API_URL and
 * `withCredentials` sends the auth cookie, which the server allows via
 * enableCors({ credentials: true }).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  timeout: 30_000,
})

/**
 * Fetch and validate in one step, so every network boundary is type-safe. The
 * contract is hand-written, so the parse is what turns a drifted server into
 * an error here rather than a confusing failure downstream.
 *
 *   const health = await api.get(healthPath, healthResponse)
 *
 * The schema is always the second argument, and drives the return type — call
 * sites never write a type argument. Pair with React Query when you get there:
 * the hook owns caching, this owns parsing.
 */
export const api = {
  get: <T extends z.ZodType>(url: string, schema: T) =>
    parsed(apiClient.get(url), schema),

  post: <T extends z.ZodType>(url: string, schema: T, body?: unknown) =>
    parsed(apiClient.post(url, body), schema),

  put: <T extends z.ZodType>(url: string, schema: T, body?: unknown) =>
    parsed(apiClient.put(url, body), schema),

  patch: <T extends z.ZodType>(url: string, schema: T, body?: unknown) =>
    parsed(apiClient.patch(url, body), schema),

  delete: <T extends z.ZodType>(url: string, schema: T) =>
    parsed(apiClient.delete(url), schema),
}

async function parsed<T extends z.ZodType>(
  pending: Promise<AxiosResponse>,
  schema: T,
): Promise<z.infer<T>> {
  const { data } = await pending
  return schema.parse(data)
}
