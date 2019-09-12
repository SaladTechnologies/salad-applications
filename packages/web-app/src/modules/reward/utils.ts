import { RewardResource } from './models/RewardResource'
import { RewardCategory } from './models/RewardCategory'
import { Reward } from './models/Reward'

/** Maps from the reward category to color */
const colorFromCategory = (category: RewardCategory): string => {
  switch (category) {
    case RewardCategory.GamingGiftcard:
      return '#5e4af4'
    case RewardCategory.Donation:
      return '#DBF1C1'
    case RewardCategory.OtherGiftcard:
      return '#ef3930'
    case RewardCategory.HardwareAndPeripheral:
      return '#ffffff'
    case RewardCategory.PhysicalGood:
      return '#DBF1C1'
    case RewardCategory.Game:
      return '#DBF1C1'
    case RewardCategory.Subscription:
      return '#DBF1C1'
    default:
      return '#B2D530'
  }
}

export const rewardFromResource = (r: RewardResource): Reward => ({
  //Reward data
  id: r.id,
  name: r.name,
  description: r.description,
  price: r.price,
  image: r.image,
  category: r.category,
  checkoutTerms: r.checkoutTerms,
  tags: r.tags.map(x => x.toLowerCase()),

  //Client side
  redeemable: false,
  remainingTimeLabel: '',
  percentUnlocked: 0,
  color: colorFromCategory(r.category),
})

export const getTimeRemainingText = (reward: Reward, currentBalance: number, earningRate: number): string => {
  // Calculates the remaining time in hours
  let remainingTime = (reward.price - currentBalance) / (earningRate*3600)
  if (remainingTime < 0) return ''
  if (remainingTime < 2) return `${(remainingTime * 60).toFixed(0)} MINUTES REMAINING`
  if (remainingTime < 48) return `${remainingTime.toFixed(0)} HOURS REMAINING`
  if (remainingTime < 1104) return `${(remainingTime / 24).toFixed(0)} DAYS REMAINING`
  if (remainingTime < 2160) return `${(remainingTime / 168).toFixed(0)} WEEKS REMAINING`
  if (remainingTime < 12960) return `${(remainingTime / 720).toFixed(0)} MONTHS REMAINING`
  return 'A LONG TIME!'
}
