import type { AxiosAdapter } from 'axios'
import { AxiosHeaders, create } from 'axios'
import { describe, expect, it } from 'vitest'
import { RenderStore } from './RenderStore'
import { loadRenderExchangeRate } from './utils'

describe('RenderStore', () => {
  it('holds the quote it is given', () => {
    const store = new RenderStore()
    const exchangeRate = { rate: 2.5, asOf: new Date(), expiresAt: new Date(Date.now() + 60_000) }

    store.setExchangeRate(exchangeRate)

    expect(store.exchangeRate).toMatchObject({ rate: 2.5 })
  })

  it('holds the quote the quote query loads, which redemption reads', async () => {
    const adapter: AxiosAdapter = async (config) => ({
      data: { usdPrice: 2.5, quotedAt: '2026-11-20T00:00:00Z' },
      status: 200,
      statusText: '',
      headers: new AxiosHeaders(),
      config,
    })
    const store = new RenderStore()

    const loaded = await loadRenderExchangeRate(create({ adapter }), store)

    expect(store.exchangeRate).toMatchObject({ rate: loaded.rate, asOf: loaded.asOf })
    expect(loaded).toMatchObject({ rate: 2.5, asOf: new Date('2026-11-20T00:00:00Z') })
  })
})
