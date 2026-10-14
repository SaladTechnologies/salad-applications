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

/**
 * The tag that marks a reward as paid out to the Chef's Coinbase account email (e.g. a "RENDER to Coinbase" reward).
 * Such a reward can only be redeemed once a Coinbase email is saved.
 *
 * Tags are set on the reward in the support tool, so this tag has to be added to every Coinbase reward there.
 */
export const coinbaseEmailRequiredTag = 'requires-coinbase-email'

/** The DOM id assigned to the Coinbase email account section so it can be deep-linked to. */
export const coinbaseEmailAnchorId = 'coinbase-email'

/** The deep-link to the Coinbase email section of the account page. */
export const coinbaseEmailAccountAnchor = `/account/summary#${coinbaseEmailAnchorId}`
