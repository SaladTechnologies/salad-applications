import { RewardResource } from '../../reward/models/RewardResource'

export interface DataResource {
  xp: number
  // availableReferrals: number
  currentBalance: number
  earningVelocity: number
  currentReward: RewardResource

  lifetimeBalance: number
  machines: any[]
  totalReferrals: number
  // currentlyMining?: boolean
  // calculatedCurrentBalance?: number
  // xpBoost: number
  // miningMode?: MiningModeEnum
  // deviceInfo?: DeviceInfo
  // filtersApplied?: number[]
}
