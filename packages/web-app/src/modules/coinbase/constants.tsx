/**
 * Endpoint used to get/set/clear the authenticated user's Coinbase account email.
 *
 * Its `GET` also says, in `enabled`, whether Coinbase cash-out is available to this user. The server decides that, so
 * the feature can be opened to a few users, or to everyone, without a web app release.
 */
export const coinbaseEmailEndpointPath = '/api/v2/coinbase-account/email'

/**
 * Problem `type` codes returned when saving the Coinbase account email is rejected.
 *
 * - `invalid` (`400`) means the email address is not in a valid format.
 * - `disabled` (`403`) means Coinbase cash-out is not available to this user.
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
