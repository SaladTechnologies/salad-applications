export interface Reward {
  id: string
  name: string
  price: number
  filter: string
  redeemable: boolean
  details: string
  imageSrc: string
  /** How much of the reward has already been unlocked (0-1) */
  percentUnlocked: number
  // selected: boolean
  // percentageHeight: number
  remainingTimeLabel: string
  // remainingTime: number
  color: string
  // rewardType: number
  /** Id of the redemption modal */
  modalId: string
}
