/** The raw shape of the `GET /api/v2/render/exchange-rate` response. */
export interface RenderExchangeRateResource {
  /** The current price of a single RENDER token, expressed in USD. */
  rate: number

  /** ISO-8601 timestamp for when the quote was generated. */
  asOf?: string

  /** ISO-8601 timestamp for when the quote should be considered stale. */
  expiresAt?: string
}
