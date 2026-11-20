import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { AxiosHeaders, create } from 'axios'
import { describe, expect, it } from 'vitest'
import { fetchRewardResource } from './reward.ts'
import { fetchStorefront } from './storefront.ts'

/** Returns a client that answers every request with the body, and the requests it got. */
const clientAnswering = (data: unknown): { http: ReturnType<typeof create>; urls: (string | undefined)[] } => {
  const urls: (string | undefined)[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
    urls.push(config.url)
    return { data, status: 200, statusText: 'OK', headers: new AxiosHeaders(), config }
  }
  return { http: create({ adapter }), urls }
}

describe('reward fetches', () => {
  it('fetches the storefront from the App API', async () => {
    expect.hasAssertions()
    const { http, urls } = clientAnswering({ blocks: [] })

    await expect(fetchStorefront(http)).resolves.toStrictEqual({ blocks: [] })
    expect(urls).toStrictEqual(['/api/v2/storefront'])
  })

  it("fetches a reward's details from the App API", async () => {
    expect.hasAssertions()
    const { http, urls } = clientAnswering({ id: 'r1' })

    await expect(fetchRewardResource(http, 'r1')).resolves.toStrictEqual({ id: 'r1' })
    expect(urls).toStrictEqual(['/api/v1/rewards/r1'])
  })
})
