/**
 * Hard-coded feature flag that gates the Solana wallet management UI.
 *
 * This is intentionally a local, hard-coded constant (not an Unleash flag) so the
 * feature stays hidden until the RENDER token integration has been fully tested.
 * Flip this to `true` to expose the Solana wallet account panel.
 */
export const SOLANA_WALLET_FEATURE_ENABLED = false

export const solanaWalletEndpointPath = '/api/v2/solana/wallet'
