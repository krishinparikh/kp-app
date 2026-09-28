import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { usersPath } from '@kp-app/shared'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { apiClient } from '@/lib/api.ts'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from './hooks.ts'

const alice = {
  id: '11111111-1111-4111-8111-111111111111',
  firstName: 'Alice',
  lastName: 'Ng',
  email: 'alice@example.com',
  dob: '1990-01-01',
}

let mock: MockAdapter
let client: QueryClient
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

beforeEach(() => {
  mock = new MockAdapter(apiClient)
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
})
afterEach(() => mock.restore())

describe('users hooks', () => {
  it('useUsers loads the list', async () => {
    mock.onGet(usersPath).reply(200, [alice])
    const { result } = renderHook(() => useUsers(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([alice])
  })

  it('useUsers surfaces the server message', async () => {
    mock.onGet(usersPath).reply(500, { statusCode: 500, message: 'boom' })
    const { result } = renderHook(() => useUsers(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.status).toBe(500)
    expect(result.current.error?.message).toBe('boom')
  })

  it('useCreateUser posts and invalidates', async () => {
    mock.onPost(usersPath).reply(201, alice)
    const { result } = renderHook(() => useCreateUser(), { wrapper })
    const created = await result.current.mutateAsync({
      firstName: 'Alice',
      lastName: 'Ng',
      email: 'alice@example.com',
      dob: '1990-01-01',
    })
    expect(created).toEqual(alice)
  })

  it('useUpdateUser patches and seeds the detail cache', async () => {
    mock
      .onPatch(`${usersPath}/${alice.id}`)
      .reply(200, { ...alice, firstName: 'Alicia' })
    const { result } = renderHook(() => useUpdateUser(alice.id), { wrapper })
    await result.current.mutateAsync({ firstName: 'Alicia' })
    expect(client.getQueryData([usersPath, alice.id])).toMatchObject({
      firstName: 'Alicia',
    })
  })

  it('useDeleteUser removes the detail entry', async () => {
    client.setQueryData([usersPath, alice.id], alice)
    mock.onDelete(`${usersPath}/${alice.id}`).reply(200, alice)
    const { result } = renderHook(() => useDeleteUser(), { wrapper })
    await result.current.mutateAsync(alice.id)
    expect(client.getQueryData([usersPath, alice.id])).toBeUndefined()
  })
})
