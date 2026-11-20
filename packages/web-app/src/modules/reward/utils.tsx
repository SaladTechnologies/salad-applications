import { config } from '../../config'
import type { Reward } from './models/Reward'
import type { RewardResource } from './models/RewardResource'

export const toFullImageUrl = (url?: string): string | undefined =>
  url ? new URL(url, config.apiBaseUrl).href : undefined

export const rewardFromResource = (r: RewardResource): Reward => ({
  //Reward data
  id: r.id,
  name: r.name,
  releaseDate: r.releaseDate ? new Date(r.releaseDate) : undefined,
  addedDate: r.addedDate ? new Date(r.addedDate) : undefined,
  developerName: r.developerName,
  publisherName: r.publisherName,
  headline: r.headline,
  description: r.description,
  price: r.price,
  productValue: r.productValue,
  originalPrice: r.originalPrice,
  coverImage: toFullImageUrl(r.coverImage),
  heroImage: toFullImageUrl(r.heroImage),
  image: toFullImageUrl(r.image),
  images: r.images && r.images.map((x) => toFullImageUrl(x)),
  platform: r.platform,
  tags: r.tags && r.tags.map((x) => x.toLowerCase()),
  quantity: r.quantity,
  //TODO: Requirements...
})

export const getRewardAvailability = (reward?: Partial<Reward>): 'Out of Stock' | 'Low Quantity' | 'In Stock' => {
  return reward?.quantity === 0
    ? 'Out of Stock'
    : reward?.quantity !== undefined && reward?.quantity > 0
      ? 'Low Quantity'
      : 'In Stock'
}

export const getPercentOff = (originalPrice: number, newPrice: number) => {
  return `${((newPrice / originalPrice - 1) * 100).toFixed()}%`
}
