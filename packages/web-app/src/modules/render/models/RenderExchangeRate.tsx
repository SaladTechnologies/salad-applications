/** A time-sensitive RENDER/USD price quote returned by the App API. */
export interface RenderExchangeRate {
  /** The current price of a single RENDER token, expressed in USD. */
  rate: number

  /** When the quote was generated. */
  asOf: Date

  /** When the quote should be considered stale. May be absent if the API does not provide an explicit expiry. */
  expiresAt?: Date
}
