import { useLoadOnOpen } from './load-on-open.ts'

/** The query keys of the payout destination loads. */
const solanaWalletQueryKey = ['account', 'solana-wallet'] as const
const coinbaseEmailQueryKey = ['account', 'coinbase-email'] as const

/**
 * Runs `loadWallet` (the saved Solana wallet address), then `loadEmail` (the saved Coinbase email and whether Coinbase
 * cash-out is available), each time the desktop account summary opens, as its wallet and email sections did. Both stay
 * in their stores, which the sections and redemption read, and both loads handle their own errors.
 */
export const usePayoutDestinationLoads = (
  loadWallet: () => Promise<unknown>,
  loadEmail: () => Promise<unknown>,
): void => {
  useLoadOnOpen(solanaWalletQueryKey, loadWallet)
  useLoadOnOpen(coinbaseEmailQueryKey, loadEmail)
}
