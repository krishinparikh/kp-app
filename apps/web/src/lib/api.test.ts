import { healthPath, healthResponse } from '@kp-app/contract'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { api, apiClient } from './api.ts'

let mock: MockAdapter

beforeEach(() => {
  mock = new MockAdapter(apiClient)
})
afterEach(() => mock.restore())

describe('api.get', () => {
  it('returns the parsed body', async () => {
    mock.onGet(healthPath).reply(200, { status: 'ok' })

    await expect(api.get(healthPath, healthResponse)).resolves.toEqual({
      status: 'ok',
    })
  })

  // The test that justifies parsing rather than casting: without it, nothing
  // proves a drifted server is caught at the boundary.
  it('throws when the body does not match the schema', async () => {
    mock.onGet(healthPath).reply(200, { status: 'weird' })

    await expect(api.get(healthPath, healthResponse)).rejects.toThrow(
      z.ZodError,
    )
  })

  it('throws on a non-2xx, carrying the server error', async () => {
    mock.onGet(healthPath).reply(400, { statusCode: 400, message: 'nope' })

    const error = await api.get(healthPath, healthResponse).catch((e) => e)

    expect(error.response.status).toBe(400)
    expect(error.response.data.message).toBe('nope')
  })
})

describe('api.post', () => {
  it('sends the body and returns the parsed response', async () => {
    mock.onPost(healthPath).reply(200, { status: 'ok' })

    await expect(
      api.post(healthPath, healthResponse, { amountCents: 1 }),
    ).resolves.toEqual({ status: 'ok' })

    expect(mock.history.post[0].data).toBe('{"amountCents":1}')
  })
})
