import { QueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

/**
 * Tells TanStack Query what every hook rejects with. Without it `error` is
 * typed `Error` and reading `error.status` doesn't compile, so each hook would
 * have to restate `<Data, AxiosError>` by hand. Declared once, inferred
 * everywhere — `api.ts` already guarantees the runtime half.
 */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}

/**
 * Shared defaults for every query and mutation.
 *
 * The retry rule is the one that matters: a 404 or a 409 is the server's
 * considered answer and will not change, so retrying it just delays the error
 * by a few seconds. `error.response` being absent is axios's own way of saying
 * no handler ever saw this — a dead network, a timeout — and that is the only
 * case worth a second attempt.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        failureCount < 3 &&
        // isAxiosError, not `instanceof` — axios ships a CJS and an ESM build,
        // so the class an error came from isn't always the one we imported.
        axios.isAxiosError(error) &&
        !error.response &&
        error.code !== AxiosError.ERR_CANCELED,
      // Data is fresh for a minute; within that a remount reads the cache
      // instead of hitting the network.
      staleTime: 60_000,
    },
    // A mutation is not idempotent — never retry one automatically.
    mutations: { retry: false },
  },
})
