/**
 * Fallback time-to-live (in milliseconds) used to determine staleness when the API response does not include an
 * explicit `expiresAt`. After this window has elapsed since the quote's `asOf` time, the quote is considered stale.
 */
export const renderExchangeRateDefaultTtl = 60 * 1000

/**
 * The number of fractional digits shown for a RENDER token quote. RENDER supports more on-chain precision than is
 * useful to display, so quotes are rounded for presentation.
 */
export const renderQuoteDisplayDecimals = 4

/** The tag used to identify a reward that pays out RENDER tokens. */
export const renderRewardTag = 'render'
