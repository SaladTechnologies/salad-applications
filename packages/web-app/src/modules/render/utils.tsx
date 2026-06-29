import { renderExchangeRateDefaultTtl, renderQuoteDisplayDecimals, renderRewardTag } from './constants'
import type { RenderExchangeRate, RenderExchangeRateResource } from './models'

/**
 * The minimal shape needed to price a RENDER reward.
 *
 * Intentionally narrower than the full {@link import('../reward/models').Reward} so that the same pricing logic can be
 * applied to the leaner reward shapes used by the storefront ({@link import('../storefront/models').StorefrontRewardItemProps})
 * and search ({@link import('../reward/models').SearchResult}) flows.
 */
export interface RenderPriceableReward {
  /** The reward's tags. RENDER rewards carry the {@link renderRewardTag} tag. */
  tags?: string[]
  /** The reward's Salad Balance purchase price (USD). Used as a fallback when `productValue` is absent. */
  price?: number
  /** The number of RENDER tokens the reward grants. The displayed price is `productValue * rate`. */
  productValue?: number
}

/**
 * Determines whether a reward pays out RENDER tokens.
 *
 * Reward tags are normally lower-cased when a reward is parsed from its API resource, but the live API serves them
 * upper-cased (e.g. `"RENDER"`). The comparison is therefore done case-insensitively so the reward is recognized
 * regardless of which flow produced it, rather than relying on upstream normalization.
 */
export const isRenderReward = (reward?: { tags?: string[] }): boolean =>
  !!reward?.tags?.some((tag) => tag?.toLowerCase() === renderRewardTag)

/**
 * Computes the Salad Balance price (USD) to display for a RENDER reward.
 *
 * This is the single source of truth for RENDER reward pricing across every flow (search, storefront listing, reward
 * detail, and SaladPay checkout). The displayed price is the number of RENDER tokens the reward grants multiplied by
 * the current RENDER/USD exchange rate, rounded to {@link renderQuoteDisplayDecimals} fractional digits. When a reward
 * does not declare a `productValue`, its existing `price` is used as the token amount.
 *
 * Returns `undefined` — meaning "fall back to the reward's normal price" — when the reward is not a RENDER reward, the
 * rate is not (yet) available, or the inputs cannot produce a meaningful figure. Non-RENDER rewards are never affected.
 *
 * @param reward The reward being priced.
 * @param rate The current price of a single RENDER token, in USD.
 * @param decimals The number of fractional digits to round to. Defaults to the display precision.
 */
export const getRenderRewardPrice = (
  reward: RenderPriceableReward | undefined,
  rate: number | undefined,
  decimals: number = renderQuoteDisplayDecimals,
): number | undefined => {
  if (!isRenderReward(reward) || rate === undefined || !Number.isFinite(rate) || rate <= 0) {
    return undefined
  }

  const tokenAmount = reward?.productValue ?? reward?.price
  if (tokenAmount === undefined || !Number.isFinite(tokenAmount) || tokenAmount < 0) {
    return undefined
  }

  const price = tokenAmount * rate
  const factor = Math.pow(10, decimals)

  // Normalize through Number.EPSILON to keep rounding of values such as 1.00005 predictable.
  return Math.round((price + Number.EPSILON) * factor) / factor
}

/**
 * Formats a RENDER reward price (as produced by {@link getRenderRewardPrice}) for display.
 *
 * RENDER rewards are shown to {@link renderQuoteDisplayDecimals} decimal places, distinct from the two-decimal
 * formatting used for regular rewards.
 */
export const formatRenderRewardPrice = (
  price: number,
  decimals: number = renderQuoteDisplayDecimals,
): string => `$${price.toFixed(decimals)}`

/**
 * Parses an ISO-8601 timestamp, returning `undefined` when the value is absent or cannot be parsed.
 *
 * The App API formats `quotedAt` with a `+00:00` offset and 7-digit fractional seconds
 * (e.g. `2026-06-24T00:00:00.0000000+00:00`). `Date` handles this, but we still guard against an invalid result so a
 * malformed timestamp never produces an `Invalid Date` (which would skew staleness checks).
 */
const parseTimestamp = (value: string | undefined): Date | undefined => {
  if (!value) {
    return undefined
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * Converts a `GET /api/v2/render/exchange-rate` response into the internal {@link RenderExchangeRate} model.
 *
 * The API response uses `usdPrice` for the rate and `quotedAt` for the quote time. When `quotedAt` is missing or
 * unparseable, the provided `receivedAt` time is used so that staleness can still be tracked.
 */
export const renderExchangeRateFromResource = (
  resource: RenderExchangeRateResource,
  receivedAt: Date,
): RenderExchangeRate => ({
  rate: resource.usdPrice,
  asOf: parseTimestamp(resource.quotedAt) ?? receivedAt,
  expiresAt: parseTimestamp(resource.expiresAt),
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
