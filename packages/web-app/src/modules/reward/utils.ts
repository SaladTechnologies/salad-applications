import { RewardResource } from './models/RewardResource'
import { Reward } from './models/Reward'
import { Config } from '../../config'

const toFullImageUrl = (url?: string): string | undefined => (url ? new URL(url, Config.baseAPIUrl).href : undefined)

export const rewardFromResource = (r: RewardResource): Reward => ({
  //Reward data
  id: r.id,
  name: r.name,
  releaseDate: r.releaseDate,
  addedDate: r.addedDate,
  developerName: r.developerName,
  publisherName: r.publisherName,
  headline: r.headline,
  description: r.description,
  price: r.price,
  coverImage: toFullImageUrl(r.coverImage),
  heroImage: toFullImageUrl(r.heroImage),
  image: toFullImageUrl(r.image),
  images: r.images && r.images.map(x => toFullImageUrl(x)),
  platform: r.platform,
  category: r.category,
  tags: r.tags && r.tags.map(x => x.toLowerCase()),
  quantity: r.quantity,
  //TODO: Requirements...

  //Client side
  redeemable: false,
  remainingTimeLabel: '',
  percentUnlocked: 0,
})

export const getTimeRemainingText = (reward: Reward, currentBalance: number, earningRate: number): string => {
  // Calculates the remaining time in hours
  let remainingTime = (reward.price - currentBalance) / (earningRate * 3600)
  if (remainingTime < 0) return ''
  if (remainingTime < 2) return `${(remainingTime * 60).toFixed(0)} MINUTES REMAINING`
  if (remainingTime < 48) return `${remainingTime.toFixed(0)} HOURS REMAINING`
  if (remainingTime < 1104) return `${(remainingTime / 24).toFixed(0)} DAYS REMAINING`
  if (remainingTime < 2160) return `${(remainingTime / 168).toFixed(0)} WEEKS REMAINING`
  if (remainingTime < 12960) return `${(remainingTime / 720).toFixed(0)} MONTHS REMAINING`
  return 'A LONG TIME!'
}
