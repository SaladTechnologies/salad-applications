/**
 * Endpoint used to get/set/clear the authenticated user's Solana wallet address.
 */
export const solanaWalletEndpointPath = '/api/v2/solana/wallet'

/**
 * The tag used to identify a reward that requires the Chef to have a Solana wallet address on file before it can be
 * redeemed (e.g. RENDER token rewards, which are paid out on-chain).
 *
 * Reward tags are lower-cased when a reward is parsed from its API resource, so a case-insensitive match is not
 * required when comparing against this value.
 */
export const solanaAddressRequiredTag = 'requires-solana-address'

/** The deep-link to the Solana wallet section of the account page. */
export const solanaWalletAccountAnchor = '/account/summary#solana-wallet'

/** The DOM id assigned to the Solana wallet account section so it can be deep-linked to. */
export const solanaWalletAnchorId = 'solana-wallet'
