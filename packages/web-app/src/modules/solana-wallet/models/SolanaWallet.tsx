/**
 * Response shape for the `GET/POST /api/v2/solana/wallet` endpoints.
 *
 * The user's Solana wallet address used to receive RENDER token rewards.
 * `walletAddress` is `null` (or omitted) when the user has not set an address.
 */
export interface SolanaWallet {
  walletAddress: string | null
}
