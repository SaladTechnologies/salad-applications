/**
 * Represents a Chef's Solana wallet used for RENDER token rewards.
 *
 * Mirrors the payload returned by `GET /api/v2/solana/wallet`.
 */
export interface SolanaWallet {
  /** The Solana wallet address (base58 encoded public key). */
  walletAddress: string
}
