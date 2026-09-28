import { apiErrorBody, apiErrorMessage } from '@kp-app/shared'
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
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
 * The one thing axios can't do for itself: read the message NestJS wrote into
 * the body. Without this the caller sees "Request failed with status code 409"
 * instead of "That email is already registered".
 */
apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    const body = apiErrorBody.safeParse(error.response.data)
    if (body.success) error.message = apiErrorMessage(body.data)
  }
  return Promise.reject(error)
})

/**
 * Fetch and validate in one step, so every network boundary is type-safe. The
 * contract is hand-written, so the parse is what turns a drifted server into
 * an error here rather than a confusing failure downstream.
 *
 *   const health = await api.get(healthPath, healthResponse)
 *
 * The schema is always the second argument, and drives the return type — call
 * sites never write a type argument. The last argument is axios's own config,
 * so `signal`, `params` and headers work as documented.
 *
 * Every method rejects with an {@link AxiosError}, which you read the way
 * axios documents: `error.response` means the server answered, `error.request`
 * means it never did. See `docs/guides/frontend.md`.
 */
export const api = {
  get: <T extends z.ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig,
  ) => parsed(apiClient.get(url, config), schema),

  post: <T extends z.ZodType>(
    url: string,
    schema: T,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) => parsed(apiClient.post(url, body, config), schema),

  put: <T extends z.ZodType>(
    url: string,
    schema: T,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) => parsed(apiClient.put(url, body, config), schema),

  patch: <T extends z.ZodType>(
    url: string,
    schema: T,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) => parsed(apiClient.patch(url, body, config), schema),

  delete: <T extends z.ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig,
  ) => parsed(apiClient.delete(url, config), schema),
}

async function parsed<T extends z.ZodType>(
  pending: Promise<AxiosResponse>,
  schema: T,
): Promise<z.infer<T>> {
  const response = await pending

  // safeParse, not parse — a raw ZodError would reach the caller as a second
  // error shape, and every rejection here being an AxiosError is the point.
  // ERR_BAD_RESPONSE is axios's own code for a response it couldn't use; the
  // 2xx status tells it apart from the 5xx axios raises it for.
  const result = schema.safeParse(response.data)
  if (!result.success) {
    const error = new AxiosError(
      'The server returned an unexpected response',
      AxiosError.ERR_BAD_RESPONSE,
      response.config,
      response.request,
      response,
    )
    error.cause = result.error
    throw error
  }
  return result.data
}
