/**
 * Represents the Coinbase account email a Chef has entered for Coinbase cash-outs.
 *
 * Mirrors the payload returned by `GET /api/v2/coinbase-account/email`.
 */
export interface CoinbaseEmail {
  /**
   * The Coinbase account email, as normalized by the server.
   *
   * Optional because a Chef may not have entered an email yet, in which case
   * `GET /api/v2/coinbase-account/email` returns an empty object.
   */
  email?: string

  /** When the email was last set or changed (ISO 8601). Absent when no email is saved. */
  updatedAt?: string

  /**
   * Whether Coinbase cash-out is available to this Chef. Treated as `false` when absent, e.g. from an older server, so
   * the feature stays hidden.
   */
  enabled?: boolean
}
