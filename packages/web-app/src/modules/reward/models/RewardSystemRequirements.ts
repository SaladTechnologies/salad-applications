import { RewardSystemDetails } from './RewardSystemDetails'

export interface RewardSystemRequirements {
  /** Minimum requirements to use the reward */
  minimum?: RewardSystemDetails

  /** Recommended requirements to use the reward */
  recommended?: RewardSystemDetails
}
