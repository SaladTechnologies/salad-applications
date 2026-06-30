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
 * A cheap, name-based heuristic for whether a reward *might* pay out RENDER tokens.
 *
 * The storefront (`/api/v2/storefront`) and search (Elastic App Search) payloads that back the list/card views are lean
 * and omit `tags` entirely, so {@link isRenderReward} cannot detect a RENDER reward from them. This heuristic lets those
 * call sites decide whether it is worth fetching the authoritative reward (which *does* carry tags) to confirm and price
 * it. It is intentionally only a *gate*, never the source of truth: a name match merely triggers a confirming lookup,
 * and the {@link renderRewardTag} tag on the fetched reward remains the final authority. Gating on the name means stores
 * with no RENDER rewards (e.g. production, where the feature ships dark) issue no extra requests.
 */
export const rewardNameSuggestsRender = (name?: string): boolean => !!name && /\brender\b/i.test(name)

/**
 * Normalizes a raw `tags` value into a lower-cased string array, regardless of the shape the source API uses.
 *
 * The reward-detail and search flows already hand us `string[]`, but the storefront (`/api/v2/storefront`) payload is
 * a lean, separately-serialized shape whose `tags` may arrive as a comma-separated string or as an array of relation
 * objects (e.g. `[{ name: 'RENDER' }]`) rather than plain strings. Normalizing here means RENDER rewards are detected
 * on the storefront listing no matter which of those shapes the API returns. Returns `undefined` when no usable tag
 * can be extracted so callers fall back to regular pricing.
 */
export const normalizeRenderTags = (raw: unknown): string[] | undefined => {
  const stringFrom = (record: Record<string, unknown>): string | undefined => {
    const candidate = record.name ?? record.tag ?? record.value ?? record.label
    return typeof candidate === 'string' ? candidate.toLowerCase() : undefined
  }

  const fromTag = (tag: unknown): string | undefined => {
    if (typeof tag === 'string') {
      return tag.toLowerCase()
    }
    if (tag && typeof tag === 'object') {
      const record = tag as Record<string, unknown>
      // Strapi serializes a relation as `{ id, attributes: { name } }`, so look inside `attributes` as well as at
      // the top level before giving up on this tag.
      return (
        stringFrom(record) ??
        (record.attributes && typeof record.attributes === 'object'
          ? stringFrom(record.attributes as Record<string, unknown>)
          : undefined)
      )
    }
    return undefined
  }

  // Strapi v4 wraps a relation collection in `{ data: [...] }`; unwrap it so the storefront's RENDER rewards are
  // detected the same way the detail/search flows' plain `string[]` tags are.
  if (raw && typeof raw === 'object' && !Array.isArray(raw) && 'data' in (raw as Record<string, unknown>)) {
    return normalizeRenderTags((raw as Record<string, unknown>).data)
  }

  if (Array.isArray(raw)) {
    const tags = raw.map(fromTag).filter((tag): tag is string => tag !== undefined)
    return tags.length > 0 ? tags : undefined
  }

  if (typeof raw === 'string' && raw.length > 0) {
    const tags = raw
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
    return tags.length > 0 ? tags : undefined
  }

  return undefined
}

/**
 * Builds a {@link RenderPriceableReward} from an arbitrary reward-shaped object, tolerating the loosely-typed payloads
 * served by the storefront API.
 *
 * It normalizes `tags` via {@link normalizeRenderTags} and accepts the token amount under either the camelCase
 * `productValue` or the snake_case `product_value` key (the storefront payload mixes the two casing conventions). This
 * lets {@link isRenderReward}/{@link getRenderRewardPrice} resolve RENDER pricing on the storefront listing the same
 * way they already do on the detail, search, and checkout flows.
 */
export const toRenderPriceableReward = (raw: unknown): RenderPriceableReward | undefined => {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }

  const record = raw as Record<string, unknown>
  const toFiniteNumber = (value: unknown): number | undefined => {
    if (value === undefined || value === null) {
      return undefined
    }
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return {
    tags: normalizeRenderTags(record.tags),
    price: toFiniteNumber(record.price),
    productValue: toFiniteNumber(record.productValue ?? record.product_value),
  }
}

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
