import { renderExchangeRateDefaultTtl, renderQuoteDisplayDecimals, renderRewardTag } from './constants'
import type { RenderExchangeRate, RenderExchangeRateResource } from './models'

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
 * This is the single source of truth for the "you'll receive ≈ N RENDER" figure shown on the reward detail header and
 * SaladPay order summary. It is deliberately *not* used to compute a reward's displayed cost: a RENDER reward's
 * Salad Balance cost is its plain `price` (shown like any other reward), and this only derives the token amount the
 * Chef receives for that cost.
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

  // Math.round can drift on values such as 1.005; normalize through Number.EPSILON to keep precision predictable.
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
