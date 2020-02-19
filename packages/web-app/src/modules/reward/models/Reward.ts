import { RewardCategory } from './RewardCategory'

export interface Reward {
  id: string
  name: string
  headline?: string
  description: string
  price: number
  coverImage?: string
  image?: string
  category: RewardCategory
  checkoutTerms: string[]
  tags: string[]
  redeemable: boolean
  /** How much of the reward has already been unlocked (0-1) */
  percentUnlocked: number
  remainingTimeLabel: string
  color: string
  quantity?: number
}
