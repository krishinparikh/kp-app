import {
  user,
  userList,
  usersPath,
  type CreateUser,
  type UpdateUser,
} from '@kp-app/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api.ts'

/**
 * Query keys for the resource, built from the path so they can't drift from
 * the URL. `all` is a prefix of `detail`, so invalidating it invalidates every
 * user query at once — the reason these live in one object rather than being
 * written inline at each call site.
 */
const keys = {
  all: [usersPath] as const,
  detail: (id: string) => [usersPath, id] as const,
}

// Every hook below infers its error as AxiosError, via the Register declaration
// in lib/query-client.ts. Nothing here needs to name the type.

/** GET /users */
export function useUsers() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => api.get(usersPath, userList),
  })
}

/**
 * GET /users/:id
 *
 * `enabled` is how you express "not yet" — the hook still runs on every
 * render, so a conditional call is not an option.
 */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => api.get(`${usersPath}/${id}`, user),
    enabled: Boolean(id),
  })
}

/**
 * POST /users
 *
 * The list is now stale, so invalidate it rather than pushing the new row in
 * by hand — the server owns the id and the ordering.
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    // No client-side check on the way out: the server validates with this
    // same schema and its 400 carries a better message than we'd invent.
    mutationFn: (input: CreateUser) => api.post(usersPath, user, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  })
}

/**
 * PATCH /users/:id
 *
 * Seeds the detail cache with the response, then invalidates the list. One
 * round trip does both, because the server returns the updated row.
 */
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateUser) =>
      api.patch(`${usersPath}/${id}`, user, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(keys.detail(id), updated)
      return queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

/**
 * DELETE /users/:id
 *
 * Drops the detail entry outright — refetching a row that is gone would only
 * produce a 404.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`${usersPath}/${id}`, user),
    onSuccess: (_deleted, id) => {
      queryClient.removeQueries({ queryKey: keys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}
