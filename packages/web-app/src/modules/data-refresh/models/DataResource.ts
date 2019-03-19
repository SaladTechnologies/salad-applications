import { RewardResource } from '../../reward/models/RewardResource'
import { ReferralResource } from '../../referral/models/ReferralResource'

export interface DataResource {
  xp: number
  activeReferrals: ReferralResource[]
  // availableReferrals: number
  currentBalance: number
  earningVelocity: number
  currentReward: RewardResource

  // lifetimeBalance: number
  // machines?: Machine[]
  // totalReferrals: number
  // currentlyMining?: boolean
  // calculatedCurrentBalance?: number
  // xpBoost: number
  // miningMode?: MiningModeEnum
  // deviceInfo?: DeviceInfo
  // filtersApplied?: number[]
}
