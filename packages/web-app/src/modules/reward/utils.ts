import { RewardResource } from './models/RewardResource'
import { Reward } from './models/Reward'

export const rewardFromResource = (r: RewardResource): Reward => ({
  id: String(r.rewardId),
  name: r.name,
  details: r.detailsCard,
  price: r.price,
  filter: r.filter.toLowerCase(),
  color: r.color,
  redeemable: false,
  imageSrc: r.imageLink,
  remainingTimeLabel: '',
  percentUnlocked: 0,
  modalId: String(r.initialModal),
})

export const getTimeRemainingText = (reward: Reward, currentBalance: number, earningRate: number): string => {
  // Calculates the remaining time in hours
  let remainingTime = (reward.price - currentBalance) / earningRate
  if (remainingTime < 0) return ''
  if (remainingTime < 2) return `${(remainingTime * 60).toFixed(0)} MINUTES REMAINING`
  if (remainingTime < 48) return `${remainingTime.toFixed(0)} HOURS REMAINING`
  if (remainingTime < 1104) return `${(remainingTime / 24).toFixed(0)} DAYS REMAINING`
  if (remainingTime < 2160) return `${(remainingTime / 168).toFixed(0)} WEEKS REMAINING`
  if (remainingTime < 12960) return `${(remainingTime / 720).toFixed(0)} MONTHS REMAINING`
  return 'A LONG TIME!'
}
