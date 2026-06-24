/**
 * Hard-coded feature flag that gates the Solana wallet account panel.
 *
 * The RENDER token integration is still undergoing integration testing, so the
 * panel (and any navigation entry that links to it) must stay hidden until this
 * is flipped to `true`. This is intentionally a simple compile-time constant
 * rather than a remote flag so it can be safely shipped in the off state.
 */
export const SOLANA_WALLET_ENABLED = false;

/** Endpoint used to get/set/clear the authenticated user's Solana wallet address. */
export const solanaWalletEndpointPath = "/api/v2/solana/wallet";
