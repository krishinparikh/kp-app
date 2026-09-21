import { healthPath, healthResponse } from '@kp-app/contract'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from './api.ts'

const responds = (body: string, init: ResponseInit) =>
  vi.fn().mockResolvedValue(new Response(body, init))

afterEach(() => vi.unstubAllGlobals())

describe('apiRequest', () => {
  it('parses a 200 body against the schema', async () => {
    vi.stubGlobal('fetch', responds('{"status":"ok"}', { status: 200 }))

    await expect(apiRequest(healthPath, healthResponse)).resolves.toEqual({
      status: 'ok',
    })
  })

  // The test that justifies parsing rather than casting: without it, nothing
  // proves a drifted server is caught at the boundary.
  it('throws when a 200 body does not match the schema', async () => {
    vi.stubGlobal('fetch', responds('{"status":"weird"}', { status: 200 }))

    await expect(apiRequest(healthPath, healthResponse)).rejects.toThrow()
  })

  it('throws ApiError with the flattened message on a 400', async () => {
    vi.stubGlobal(
      'fetch',
      responds('{"statusCode":400,"message":["a","b"],"error":"Bad Request"}', {
        status: 400,
      }),
    )

    await expect(apiRequest(healthPath, healthResponse)).rejects.toMatchObject({
      status: 400,
      message: 'a; b',
    })
  })

  it('falls back to statusText when the error body is not JSON', async () => {
    vi.stubGlobal('fetch', responds('<html>502</html>', { status: 502 }))

    const error = await apiRequest(healthPath, healthResponse).catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.body).toBeUndefined()
  })

  it('sends a JSON body and content type for a POST', async () => {
    const fetchMock = responds('{"status":"ok"}', { status: 200 })
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest(healthPath, healthResponse, {
      method: 'POST',
      body: { amountCents: 1 },
    })

    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: '{"amountCents":1}',
      headers: { 'Content-Type': 'application/json' },
    })
  })
})
