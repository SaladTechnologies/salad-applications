/**
 * The raw shape of the `GET /api/v2/render/exchange-rate` response.
 *
 * The App API returns the quote as `{ quotedAt, usdPrice }` (e.g.
 * `{ "quotedAt": "2026-06-24T00:00:00.0000000+00:00", "usdPrice": 0.9997050031114633 }`). These field names are mapped
 * onto the internal {@link RenderExchangeRate} model by `renderExchangeRateFromResource`.
 */
export interface RenderExchangeRateResource {
  /** The current price of a single RENDER token, expressed in USD. */
  usdPrice: number

  /** ISO-8601 timestamp for when the quote was generated. */
  quotedAt?: string

  /** ISO-8601 timestamp for when the quote should be considered stale. May be absent from the response. */
  expiresAt?: string
}
