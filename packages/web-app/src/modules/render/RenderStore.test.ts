import { describe, expect, it } from 'vitest'
import { RenderStore } from './RenderStore'

describe('RenderStore', () => {
  it('holds the quote it is given', () => {
    const store = new RenderStore()
    const exchangeRate = { rate: 2.5, asOf: new Date(), expiresAt: new Date(Date.now() + 60_000) }

    store.setExchangeRate(exchangeRate)

    expect(store.exchangeRate).toMatchObject({ rate: 2.5 })
    expect(store.isExchangeRateStale).toBe(false)
  })

  it('treats an expired quote as stale', () => {
    const store = new RenderStore()

    store.setExchangeRate({ rate: 2.5, asOf: new Date(0), expiresAt: new Date(1) })

    expect(store.isExchangeRateStale).toBe(true)
  })
})
