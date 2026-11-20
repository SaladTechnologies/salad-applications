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
