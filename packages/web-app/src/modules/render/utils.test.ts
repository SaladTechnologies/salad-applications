import type { Reward } from '../reward/models'
import { renderExchangeRateDefaultTtl } from './constants'
import type { RenderExchangeRate } from './models'
import {
  computeRenderQuote,
  isExchangeRateStale,
  isRenderReward,
  renderExchangeRateFromResource,
} from './utils'

describe('computeRenderQuote', () => {
  it('converts a USD balance into RENDER tokens at the given rate', () => {
    // $10 of balance at $2.50 / RENDER = 4 RENDER
    expect(computeRenderQuote(10, 2.5)).toBe(4)
  })

  it('rounds to the requested number of decimals', () => {
    // 1 / 3 = 0.3333... -> 0.3333 at the default (4) precision
    expect(computeRenderQuote(1, 3)).toBe(0.3333)
    expect(computeRenderQuote(1, 3, 2)).toBe(0.33)
    expect(computeRenderQuote(1, 3, 8)).toBe(0.33333333)
  })

  it('returns 0 for a zero balance', () => {
    expect(computeRenderQuote(0, 2.5)).toBe(0)
  })

  it('handles large values without losing the integer part', () => {
    expect(computeRenderQuote(1_000_000, 0.5)).toBe(2_000_000)
  })

  it('returns undefined when the rate is zero or negative', () => {
    expect(computeRenderQuote(10, 0)).toBeUndefined()
    expect(computeRenderQuote(10, -1)).toBeUndefined()
  })

  it('returns undefined for non-finite or negative inputs', () => {
    expect(computeRenderQuote(NaN, 2)).toBeUndefined()
    expect(computeRenderQuote(10, NaN)).toBeUndefined()
    expect(computeRenderQuote(Infinity, 2)).toBeUndefined()
    expect(computeRenderQuote(-5, 2)).toBeUndefined()
  })
})

describe('isRenderReward', () => {
  const makeReward = (tags: string[]): Reward => ({ id: '1', name: 'r', price: 5, tags })

  it('returns true when the reward carries the render tag', () => {
    expect(isRenderReward(makeReward(['render', 'crypto']))).toBe(true)
  })

  it('returns false when the reward has no render tag', () => {
    expect(isRenderReward(makeReward(['steam']))).toBe(false)
  })

  it('returns false for an undefined reward', () => {
    expect(isRenderReward(undefined)).toBe(false)
  })
})

describe('renderExchangeRateFromResource', () => {
  it('maps the API resource and parses timestamps', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')
    const result = renderExchangeRateFromResource(
      { rate: 2.5, asOf: '2026-06-24T00:00:00.000Z', expiresAt: '2026-06-24T00:01:00.000Z' },
      receivedAt,
    )

    expect(result.rate).toBe(2.5)
    expect(result.asOf.toISOString()).toBe('2026-06-24T00:00:00.000Z')
    expect(result.expiresAt?.toISOString()).toBe('2026-06-24T00:01:00.000Z')
  })

  it('falls back to receivedAt when asOf is missing', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')
    const result = renderExchangeRateFromResource({ rate: 2.5 }, receivedAt)

    expect(result.asOf).toBe(receivedAt)
    expect(result.expiresAt).toBeUndefined()
  })
})

describe('isExchangeRateStale', () => {
  const asOf = new Date('2026-06-24T00:00:00.000Z')

  it('returns false when no quote is present', () => {
    expect(isExchangeRateStale(undefined)).toBe(false)
  })

  it('uses expiresAt when available', () => {
    const rate: RenderExchangeRate = { rate: 2.5, asOf, expiresAt: new Date('2026-06-24T00:01:00.000Z') }
    expect(isExchangeRateStale(rate, new Date('2026-06-24T00:00:59.000Z'))).toBe(false)
    expect(isExchangeRateStale(rate, new Date('2026-06-24T00:01:00.000Z'))).toBe(true)
  })

  it('falls back to the default TTL when expiresAt is absent', () => {
    const rate: RenderExchangeRate = { rate: 2.5, asOf }
    const justBefore = new Date(asOf.getTime() + renderExchangeRateDefaultTtl - 1)
    const atTtl = new Date(asOf.getTime() + renderExchangeRateDefaultTtl)

    expect(isExchangeRateStale(rate, justBefore)).toBe(false)
    expect(isExchangeRateStale(rate, atTtl)).toBe(true)
  })
})
