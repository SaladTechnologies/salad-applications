import { solanaAddressRequiredTag } from './constants'

/**
 * Determines whether a reward requires the Chef to have a Solana wallet address on file before it can be redeemed.
 *
 * Reward tags are normally lower-cased when a reward is parsed from its API resource, but the comparison is done
 * case-insensitively so the reward is recognized regardless of which flow produced it.
 */
export const rewardRequiresSolanaAddress = (reward?: { tags?: string[] }): boolean =>
  !!reward?.tags?.some((tag) => tag?.toLowerCase() === solanaAddressRequiredTag)
