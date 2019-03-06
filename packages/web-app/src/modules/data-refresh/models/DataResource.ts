import { RewardResource } from '../../reward/models/RewardResource'

export interface DataResource {
  xp: number
  // activeReferrals?: Referral[]
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
