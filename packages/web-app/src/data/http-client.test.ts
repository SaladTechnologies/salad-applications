import type { AxiosAdapter, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AxiosError, AxiosHeaders } from 'axios'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { createHttpClient } from './http-client.ts'
import { SaladError } from './salad-error.ts'

const baseURL = 'https://app-api.test'

/** A response the fake App API sends: a status (0 for no response), a body, and headers. */
interface Reply {
  status: number
  data?: unknown
  headers?: Record<string, string>
}

/** The client under test, the requests it sent, and spies for its handlers. */
interface Setup {
  client: AxiosInstance
  requests: InternalAxiosRequestConfig[]
  onUnauthorized: Mock<() => void>
  onSudoRequired: Mock<(action: unknown) => void>
}

/** Creates a client whose requests get the replies in order, rejected as axios does for a status outside 2xx. */
const setUp = (...replies: Reply[]): Setup => {
  const requests: InternalAxiosRequestConfig[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config)
    const reply = replies.shift() ?? { status: 200 }
    if (reply.status === 0) {
      throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config)
    }
    const response = {
      data: reply.data ?? {},
      status: reply.status,
      statusText: '',
      headers: new AxiosHeaders(reply.headers),
      config,
    }
    if (reply.status >= 200 && reply.status < 300) {
      return response
    }
    throw new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, config, undefined, response)
  }
  const onUnauthorized = vi.fn<() => void>()
  const onSudoRequired = vi.fn<(action: unknown) => void>()
  const client = createHttpClient({ baseURL, onUnauthorized, onSudoRequired })
  client.defaults.adapter = adapter
  return { client, requests, onUnauthorized, onSudoRequired }
}

describe('createHttpClient', () => {
  it('sends the session cookie and the XSRF header to the App API', async () => {
    expect.hasAssertions()
    const { client, requests } = setUp({ status: 200 })

    await client.get('/api/v1/profile')

    expect(requests[0]).toMatchObject({ withCredentials: true, baseURL, timeout: 10_000 })
    expect(requests[0]?.headers.get('X-XSRF-TOKEN')).toBe('1')
  })

  it('reports the end of the session on a 401', async () => {
    expect.hasAssertions()
    const { client, onUnauthorized, onSudoRequired } = setUp({ status: 401 })

    await expect(client.get('/api/v1/profile')).rejects.toBeInstanceOf(AxiosError)

    expect(onUnauthorized).toHaveBeenCalledExactlyOnceWith()
    expect(onSudoRequired).not.toHaveBeenCalled()
  })

  it('reports the blocked request on a 401 that asks for sudo mode', async () => {
    expect.hasAssertions()
    const { client, onUnauthorized, onSudoRequired } = setUp({
      status: 401,
      headers: { 'WWW-Authenticate': 'Sudo-Cookies' },
    })

    await expect(client.post('/api/v2/redemptions', { rewardId: 'r1' })).rejects.toBeInstanceOf(AxiosError)

    expect(onSudoRequired).toHaveBeenCalledExactlyOnceWith({
      method: 'post',
      url: '/api/v2/redemptions',
      data: { rewardId: 'r1' },
    })
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('ignores a 401 from another API', async () => {
    expect.hasAssertions()
    const { client, onUnauthorized, onSudoRequired } = setUp({ status: 401 })

    await expect(client.get('/thing', { baseURL: 'https://elsewhere.test' })).rejects.toBeInstanceOf(AxiosError)

    expect(onUnauthorized).not.toHaveBeenCalled()
    expect(onSudoRequired).not.toHaveBeenCalled()
  })

  it('rejects a problem response with a SaladError', async () => {
    expect.hasAssertions()
    const { client } = setUp({ status: 409, data: { status: 409, type: 'rewards:outOfStock', title: 'Out of stock' } })

    const failure: unknown = await client.post('/api/v2/redemptions').catch((error: unknown) => error)

    expect(failure).toBeInstanceOf(SaladError)
    expect(failure).toMatchObject({
      status: 409,
      type: 'rewards:outOfStock',
      title: 'Out of stock',
      message: 'This reward has run out. Check back later!',
    })
  })

  it('passes a request that got no response through unchanged', async () => {
    expect.hasAssertions()
    const { client, onUnauthorized, onSudoRequired } = setUp({ status: 0 })
    await expect(client.post('/api/v2/redemptions')).rejects.toMatchObject({
      name: 'AxiosError',
      code: AxiosError.ERR_NETWORK,
    })

    expect(onUnauthorized).not.toHaveBeenCalled()
    expect(onSudoRequired).not.toHaveBeenCalled()
  })

  it('retries a GET that failed on the server, but not a POST', async () => {
    expect.hasAssertions()
    const get = setUp({ status: 503 }, { status: 200 })
    const post = setUp({ status: 503 }, { status: 200 })

    await get.client.get('/api/v1/profile')
    await expect(post.client.post('/api/v2/redemptions')).rejects.toBeInstanceOf(AxiosError)

    expect(get.requests).toHaveLength(2)
    expect(post.requests).toHaveLength(1)
  })
})
