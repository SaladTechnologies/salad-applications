import { describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import type { AxiosInstance } from 'axios'
import { RenderStore } from './RenderStore'

const makeAxios = (get: Mock): AxiosInstance => ({ get }) as unknown as AxiosInstance

describe('RenderStore', () => {
  it('fetches and stores the quote', async () => {
    const get = vi.fn().mockResolvedValue({
      data: { usdPrice: 2.5, quotedAt: '2026-06-24T00:00:00.000Z', expiresAt: '2026-06-24T00:01:00.000Z' },
    })
    const store = new RenderStore(makeAxios(get))

    await store.fetchExchangeRate()

    expect(get).toHaveBeenCalledWith('/api/v2/render/exchange-rate')
    expect(store.exchangeRate?.rate).toBe(2.5)
    expect(store.hasExchangeRateError).toBe(false)
    expect(store.isLoadingExchangeRate).toBe(false)
  })

  it('flags an error and clears loading when the request fails', async () => {
    const get = vi.fn().mockRejectedValue(new Error('boom'))
    const store = new RenderStore(makeAxios(get))

    await store.fetchExchangeRate()

    expect(store.hasExchangeRateError).toBe(true)
    expect(store.exchangeRate).toBeUndefined()
    expect(store.isLoadingExchangeRate).toBe(false)
  })
})
