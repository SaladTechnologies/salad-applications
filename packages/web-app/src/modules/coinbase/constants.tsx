/**
 * Internal, hard-coded feature flag that gates the Coinbase cash-out integration.
 *
 * It is intentionally a compile-time constant rather than a remote/third-party flag (e.g. Unleash): the feature ships
 * dark while this is `false` — no Coinbase UI is rendered and no calls are made to the Coinbase account email
 * endpoint. Flip it to `true` and redeploy to turn the feature on.
 */
export const COINBASE_CASHOUT_ENABLED: boolean = false

/**
 * Endpoint used to get/set/clear the authenticated user's Coinbase account email.
 */
export const coinbaseEmailEndpointPath = '/api/v2/coinbase-account/email'

/**
 * Problem `type` codes returned when saving the Coinbase account email is rejected.
 *
 * - `invalid` (`400`) means the email address is not in a valid format.
 * - `disabled` (`403`) means saving a Coinbase account email is switched off on the server.
 */
export const coinbaseEmailInvalidProblemType = 'coinbaseEmail:invalid'
export const coinbaseEmailDisabledProblemType = 'coinbaseEmail:disabled'
