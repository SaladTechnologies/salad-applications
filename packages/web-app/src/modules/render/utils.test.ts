import type { Reward } from '../reward/models'
import { renderExchangeRateDefaultTtl } from './constants'
import type { RenderExchangeRate } from './models'
import {
  computeRenderQuote,
  formatRenderRewardPrice,
  getRenderRewardPrice,
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

  it('matches the render tag case-insensitively (live API serves uppercase tags)', () => {
    expect(isRenderReward(makeReward(['RENDER']))).toBe(true)
    expect(isRenderReward(makeReward(['Render', 'crypto']))).toBe(true)
  })

  it('returns false when the reward has no render tag', () => {
    expect(isRenderReward(makeReward(['steam']))).toBe(false)
  })

  it('returns false for an undefined reward', () => {
    expect(isRenderReward(undefined)).toBe(false)
  })
})

describe('getRenderRewardPrice', () => {
  const renderReward = (productValue?: number, price = 5): Reward => ({
    id: '1',
    name: 'r',
    price,
    productValue,
    tags: ['render'],
  })

  it('prices a render reward as productValue * rate, rounded to 4 decimals', () => {
    // 12 RENDER at $0.123456 = $1.481472 -> $1.4815
    expect(getRenderRewardPrice(renderReward(12), 0.123456)).toBe(1.4815)
  })

  it('falls back to the reward price when productValue is absent', () => {
    // 5 (price) * 2 = 10
    expect(getRenderRewardPrice(renderReward(undefined, 5), 2)).toBe(10)
  })

  it('multiplies the price fallback by the rate rather than returning it verbatim', () => {
    // Regression: a 1.0-token reward with no productValue at a $0.9997 rate must show $0.9997, not $1.00.
    expect(getRenderRewardPrice(renderReward(undefined, 1), 0.9997)).toBe(0.9997)
  })

  it('respects a custom decimal precision', () => {
    expect(getRenderRewardPrice(renderReward(1), 1 / 3, 2)).toBe(0.33)
  })

  it('returns undefined for non-render rewards', () => {
    const reward: Reward = { id: '1', name: 'r', price: 5, productValue: 12, tags: ['steam'] }
    expect(getRenderRewardPrice(reward, 2)).toBeUndefined()
  })

  it('returns undefined when the rate is missing or invalid', () => {
    expect(getRenderRewardPrice(renderReward(12), undefined)).toBeUndefined()
    expect(getRenderRewardPrice(renderReward(12), 0)).toBeUndefined()
    expect(getRenderRewardPrice(renderReward(12), -1)).toBeUndefined()
  })

  it('returns undefined when there is no usable token amount', () => {
    const reward: Reward = { id: '1', name: 'r', price: NaN, tags: ['render'] }
    expect(getRenderRewardPrice(reward, 2)).toBeUndefined()
  })
})

describe('formatRenderRewardPrice', () => {
  it('formats to four decimal places by default', () => {
    expect(formatRenderRewardPrice(1.4815)).toBe('$1.4815')
    expect(formatRenderRewardPrice(10)).toBe('$10.0000')
  })

  it('respects a custom precision', () => {
    expect(formatRenderRewardPrice(1.5, 2)).toBe('$1.50')
  })
})

describe('renderExchangeRateFromResource', () => {
  it('maps the live API resource (usdPrice -> rate, quotedAt -> asOf)', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')
    const result = renderExchangeRateFromResource(
      { usdPrice: 0.9997050031114633, quotedAt: '2026-06-24T00:00:00.0000000+00:00' },
      receivedAt,
    )

    // The mapped rate must equal usdPrice exactly so a 1.0-token reward shows $0.9997, not $1.00.
    expect(result.rate).toBe(0.9997050031114633)
    expect(result.asOf.toISOString()).toBe('2026-06-24T00:00:00.000Z')
    expect(result.expiresAt).toBeUndefined()
  })

  it('maps an explicit expiresAt when present', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')
    const result = renderExchangeRateFromResource(
      { usdPrice: 2.5, quotedAt: '2026-06-24T00:00:00.000Z', expiresAt: '2026-06-24T00:01:00.000Z' },
      receivedAt,
    )

    expect(result.rate).toBe(2.5)
    expect(result.asOf.toISOString()).toBe('2026-06-24T00:00:00.000Z')
    expect(result.expiresAt?.toISOString()).toBe('2026-06-24T00:01:00.000Z')
  })

  it('falls back to receivedAt when quotedAt is missing or unparseable', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')

    expect(renderExchangeRateFromResource({ usdPrice: 2.5 }, receivedAt).asOf).toBe(receivedAt)
    expect(renderExchangeRateFromResource({ usdPrice: 2.5, quotedAt: 'not-a-date' }, receivedAt).asOf).toBe(receivedAt)
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
