import { healthPath, healthResponse } from '@kp-app/shared'
import axios, { AxiosError } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { api, apiClient } from './api.ts'

/** Every failure path returns this, so the assertions read the same way. */
const failing = (call: Promise<unknown>): Promise<AxiosError> =>
  call.then(
    () => {
      throw new Error('expected the call to reject')
    },
    (error: AxiosError) => error,
  )

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
  it('rejects when the body does not match the schema', async () => {
    mock.onGet(healthPath).reply(200, { status: 'weird' })

    const error = await failing(api.get(healthPath, healthResponse))

    expect(axios.isAxiosError(error)).toBe(true)
    expect(error.code).toBe(AxiosError.ERR_BAD_RESPONSE)
    expect(error.cause?.name).toBe('ZodError')
  })

  it('rejects on a non-2xx, carrying the server message', async () => {
    mock.onGet(healthPath).reply(400, { statusCode: 400, message: 'nope' })

    const error = await failing(api.get(healthPath, healthResponse))

    expect(error.status).toBe(400)
    expect(error.message).toBe('nope')
  })

  it('joins the list a validation pipe returns', async () => {
    mock
      .onGet(healthPath)
      .reply(400, { statusCode: 400, message: ['too short', 'not an email'] })

    const error = await failing(api.get(healthPath, healthResponse))

    expect(error.message).toBe('too short; not an email')
  })

  it('leaves axios its own message when the body is not an API error', async () => {
    mock.onGet(healthPath).reply(502, '<html>bad gateway</html>')

    const error = await failing(api.get(healthPath, healthResponse))

    expect(error.status).toBe(502)
    expect(error.message).toBe('Request failed with status code 502')
  })

  it('rejects with no response when the request never lands', async () => {
    mock.onGet(healthPath).networkError()

    const error = await failing(api.get(healthPath, healthResponse))

    // isAxiosError, not `instanceof` — the adapter builds this from its own
    // copy of axios, so the class is not the one imported above.
    expect(axios.isAxiosError(error)).toBe(true)
    expect(error.response).toBeUndefined()
  })

  it('rejects with a timeout code when the request times out', async () => {
    mock.onGet(healthPath).timeout()

    const error = await failing(api.get(healthPath, healthResponse))

    expect(error.code).toBe(AxiosError.ECONNABORTED)
    expect(error.response).toBeUndefined()
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
