import type { Reward } from '../reward/models'
import { renderExchangeRateDefaultTtl } from './constants'
import type { RenderExchangeRate } from './models'
import {
  computeRenderQuote,
  isExchangeRateStale,
  isRenderReward,
  normalizeRenderTags,
  renderExchangeRateFromResource,
} from './utils'

describe('computeRenderQuote', () => {
  it('converts a USD balance into RENDER tokens at the given rate', () => {
    // $10 of balance at $2.50 / RENDER = 4 RENDER
    expect(computeRenderQuote(10, 2.5)).toBe(4)
  })

  it('converts a $1 reward at the live rate into the RENDER received (price / rate, not price * rate)', () => {
    // Regression: a $1.00 reward at a $0.9996745593593998 rate yields ~1.0003 RENDER, not ~1.00.
    expect(computeRenderQuote(1, 0.9996745593593998)).toBe(1.0003)
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

  it('returns undefined when the rate is zero or negative (guards against divide-by-zero)', () => {
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

describe('normalizeRenderTags', () => {
  it('lower-cases an array of string tags', () => {
    expect(normalizeRenderTags(['RENDER', 'Crypto'])).toEqual(['render', 'crypto'])
  })

  it('extracts tag names from an array of relation objects', () => {
    expect(normalizeRenderTags([{ name: 'RENDER' }, { name: 'crypto' }])).toEqual(['render', 'crypto'])
  })

  it('splits and trims a comma-separated string', () => {
    expect(normalizeRenderTags('RENDER, crypto ')).toEqual(['render', 'crypto'])
  })

  it('extracts tag names nested under a Strapi relation `attributes`', () => {
    expect(normalizeRenderTags([{ attributes: { name: 'RENDER' } }, { attributes: { name: 'crypto' } }])).toEqual([
      'render',
      'crypto',
    ])
  })

  it('unwraps a Strapi v4 `{ data: [...] }` relation collection', () => {
    expect(normalizeRenderTags({ data: [{ id: 1, attributes: { name: 'RENDER' } }] })).toEqual(['render'])
    expect(normalizeRenderTags({ data: ['RENDER', 'crypto'] })).toEqual(['render', 'crypto'])
  })

  it('returns undefined for empty or unusable input', () => {
    expect(normalizeRenderTags(undefined)).toBeUndefined()
    expect(normalizeRenderTags([])).toBeUndefined()
    expect(normalizeRenderTags('')).toBeUndefined()
    expect(normalizeRenderTags([{ foo: 'bar' }])).toBeUndefined()
    expect(normalizeRenderTags({ data: [] })).toBeUndefined()
  })
})

describe('renderExchangeRateFromResource', () => {
  it('maps the live API resource (usdPrice -> rate, quotedAt -> asOf)', () => {
    const receivedAt = new Date('2026-06-24T00:00:30.000Z')
    const result = renderExchangeRateFromResource(
      { usdPrice: 0.9997050031114633, quotedAt: '2026-06-24T00:00:00.0000000+00:00' },
      receivedAt,
    )

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
