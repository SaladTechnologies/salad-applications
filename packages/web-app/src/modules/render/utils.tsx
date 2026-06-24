import type { Reward } from '../reward/models'
import { renderExchangeRateDefaultTtl, renderQuoteDisplayDecimals, renderRewardTag } from './constants'
import type { RenderExchangeRate, RenderExchangeRateResource } from './models'

/**
 * Determines whether a reward pays out RENDER tokens.
 *
 * Reward tags are lower-cased when a reward is parsed from its API resource, so a case-insensitive match is not
 * required here.
 */
export const isRenderReward = (reward?: Reward): boolean => !!reward?.tags?.includes(renderRewardTag)

/**
 * Converts a `GET /api/v2/render/exchange-rate` response into the internal {@link RenderExchangeRate} model.
 *
 * When the API omits `asOf`, the provided `receivedAt` time is used so that staleness can still be tracked.
 */
export const renderExchangeRateFromResource = (
  resource: RenderExchangeRateResource,
  receivedAt: Date,
): RenderExchangeRate => ({
  rate: resource.rate,
  asOf: resource.asOf ? new Date(resource.asOf) : receivedAt,
  expiresAt: resource.expiresAt ? new Date(resource.expiresAt) : undefined,
})

/**
 * Computes how many RENDER tokens a given amount of Salad Balance (USD) converts to at the supplied price.
 *
 * @param saladBalance The amount of Salad Balance to convert, in USD.
 * @param rate The price of a single RENDER token, in USD.
 * @param decimals The number of fractional digits to round the result to. Defaults to the display precision.
 * @returns The number of RENDER tokens, or `undefined` when the inputs cannot produce a meaningful quote.
 */
export const computeRenderQuote = (
  saladBalance: number,
  rate: number,
  decimals: number = renderQuoteDisplayDecimals,
): number | undefined => {
  if (!Number.isFinite(saladBalance) || !Number.isFinite(rate) || rate <= 0 || saladBalance < 0) {
    return undefined
  }

  const tokens = saladBalance / rate
  const factor = Math.pow(10, decimals)

  // Math.round can drift on values such as 1.005; normalize through a string round-trip to keep precision predictable.
  return Math.round((tokens + Number.EPSILON) * factor) / factor
}

/**
 * Determines whether a quote is stale relative to `now`.
 *
 * A quote is stale once its `expiresAt` has passed. When no explicit expiry is provided, a quote is considered stale
 * after {@link renderExchangeRateDefaultTtl} has elapsed since its `asOf` time.
 */
export const isExchangeRateStale = (rate: RenderExchangeRate | undefined, now: Date = new Date()): boolean => {
  if (!rate) {
    return false
  }

  if (rate.expiresAt) {
    return now.getTime() >= rate.expiresAt.getTime()
  }

  return now.getTime() - rate.asOf.getTime() >= renderExchangeRateDefaultTtl
}
