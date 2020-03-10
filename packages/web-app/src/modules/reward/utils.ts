import { RewardResource } from './models/RewardResource'
import { Reward } from './models/Reward'
import { Config } from '../../config'

const toFullImageUrl = (url?: string): string | undefined => (url ? new URL(url, Config.baseAPIUrl).href : undefined)

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
  coverImage: toFullImageUrl(r.coverImage),
  heroImage: toFullImageUrl(r.heroImage),
  image: toFullImageUrl(r.image),
  images: r.images && r.images.map(x => toFullImageUrl(x)),
  platform: r.platform,
  tags: r.tags && r.tags.map(x => x.toLowerCase()),
  quantity: r.quantity,
  //TODO: Requirements...
})

export const encodeCategory = (category: string): string => {
  return encodeURIComponent(category.toLowerCase().replace(/\s/g, '-'))
}

export const decodeCategory = (category: string): string => {
  return decodeURIComponent(category.toLowerCase().replace(/-/g, ' '))
}
