/**
 * Represents a Chef's Solana wallet used for RENDER token rewards.
 *
 * Mirrors the payload returned by `GET /api/v2/solana/wallet`.
 */
export interface SolanaWallet {
  /**
   * The Solana wallet address (base58 encoded public key).
   *
   * Optional because a Chef may not have set a wallet address yet, in which
   * case `GET /api/v2/solana/wallet` returns no address.
   */
  walletAddress?: string
}
