import { COINBASE_CASHOUT_ENABLED, coinbaseEmailRequiredTag } from './constants'

/**
 * Determines whether a reward is paid out to the Chef's Coinbase account email, so it needs one saved before it can be
 * redeemed.
 *
 * Always `false` while the {@link COINBASE_CASHOUT_ENABLED} flag is off, so none of the Coinbase reward UI renders and
 * the Coinbase email is never loaded. The tag comparison is case-insensitive, like the Solana wallet tag.
 *
 * @param enabled Whether the Coinbase cash-out feature is on. Injectable so tests can exercise both paths.
 */
export const rewardRequiresCoinbaseEmail = (
  reward?: { tags?: string[] },
  enabled: boolean = COINBASE_CASHOUT_ENABLED,
): boolean => enabled && !!reward?.tags?.some((tag) => tag?.toLowerCase() === coinbaseEmailRequiredTag)
