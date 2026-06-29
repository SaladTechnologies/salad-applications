import { solanaAddressRequiredTag } from './constants'

/**
 * Determines whether a reward requires the Chef to have a Solana wallet address on file before it can be redeemed.
 *
 * Reward tags are lower-cased when a reward is parsed from its API resource, so a case-insensitive match is not
 * required here.
 */
export const rewardRequiresSolanaAddress = (reward?: { tags?: string[] }): boolean =>
  !!reward?.tags?.includes(solanaAddressRequiredTag)
