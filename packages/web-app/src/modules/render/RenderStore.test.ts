import type { AxiosInstance } from 'axios'
import { RenderStore } from './RenderStore'

const makeAxios = (get: jest.Mock): AxiosInstance => ({ get } as unknown as AxiosInstance)

describe('RenderStore', () => {
  it('does not fetch when the feature flag is off', async () => {
    const get = jest.fn()
    const store = new RenderStore(makeAxios(get), false)

    await store.fetchExchangeRate()

    expect(get).not.toHaveBeenCalled()
    expect(store.exchangeRate).toBeUndefined()
    expect(store.isLoadingExchangeRate).toBe(false)
  })

  it('does not poll when the feature flag is off', () => {
    const get = jest.fn()
    const store = new RenderStore(makeAxios(get), false)

    store.startPollingExchangeRate()

    expect(get).not.toHaveBeenCalled()
  })

  it('fetches and stores the quote when the flag is on', async () => {
    const get = jest.fn().mockResolvedValue({
      data: { rate: 2.5, asOf: '2026-06-24T00:00:00.000Z', expiresAt: '2026-06-24T00:01:00.000Z' },
    })
    const store = new RenderStore(makeAxios(get), true)

    await store.fetchExchangeRate()

    expect(get).toHaveBeenCalledWith('/api/v2/render/exchange-rate')
    expect(store.exchangeRate?.rate).toBe(2.5)
    expect(store.hasExchangeRateError).toBe(false)
    expect(store.isLoadingExchangeRate).toBe(false)
  })

  it('flags an error and clears loading when the request fails', async () => {
    const get = jest.fn().mockRejectedValue(new Error('boom'))
    const store = new RenderStore(makeAxios(get), true)

    await store.fetchExchangeRate()

    expect(store.hasExchangeRateError).toBe(true)
    expect(store.exchangeRate).toBeUndefined()
    expect(store.isLoadingExchangeRate).toBe(false)
  })
})
