/**
 * Internal, hard-coded feature flag that gates the entire RENDER price-quote feature.
 *
 * This is intentionally a compile-time constant rather than a remote/third-party flag (e.g. Unleash): the feature
 * ships dark while this is `false` — no quote UI is rendered and no calls are made to the exchange-rate endpoint.
 * Flip it to `true` and redeploy to turn the feature on.
 */
export const renderPriceQuotesEnabled = false

/**
 * The App API endpoint that returns the current RENDER/USD price quote.
 *
 * This endpoint is the single source of truth for the RENDER price: the rate is computed server-side and the web app
 * never performs its own price discovery (no on-chain / Jupiter calls happen client-side). The only client-side math
 * is converting a USD Salad Balance into a token amount via {@link computeRenderQuote}.
 */
export const renderExchangeRateEndpointPath = '/api/v2/render/exchange-rate'

/**
 * How frequently (in milliseconds) the RENDER price quote is refreshed while a RENDER reward view is active.
 * Quotes are time-sensitive, so we poll often enough to keep the displayed quote reasonably fresh.
 */
export const renderExchangeRateRefreshRate = 30 * 1000

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
