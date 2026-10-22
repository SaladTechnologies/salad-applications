import { coinbaseEmailRequiredTag } from './constants'

/**
 * Determines whether a reward is paid out to the Chef's Coinbase account email, so it needs one saved before it can be
 * redeemed. The tag comparison is case-insensitive, like the Solana wallet tag.
 *
 * This doesn't check whether Coinbase cash-out is available to the Chef: the server only returns a Coinbase reward to
 * Chefs it's available to, and won't save a Coinbase email for anyone else, so for them Buy Now stays blocked.
 */
export const rewardRequiresCoinbaseEmail = (reward?: { tags?: string[] }): boolean =>
  !!reward?.tags?.some((tag) => tag?.toLowerCase() === coinbaseEmailRequiredTag)
