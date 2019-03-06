export interface Reward {
  id: string
  name: string
  price: number
  filter: string
  redeemable: boolean
  // detailsCard: string
  imageSrc: string
  /** How much of the reward has already been unlocked (0-1) */
  percentUnlocked: number
  // selected: boolean
  // percentageHeight: number
  remainingTimeLabel: string
  // remainingTime: number
  // color: string
  // rewardType: number
  // initialModal: number
}
