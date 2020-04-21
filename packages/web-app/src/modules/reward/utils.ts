import { RewardResource } from './models/RewardResource'
import { Reward } from './models/Reward'
import { Config } from '../../config'
import { RewardQuery } from './models'
import queryString from 'query-string'

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
  images: r.images && r.images.map((x) => toFullImageUrl(x)),
  platform: r.platform,
  tags: r.tags && r.tags.map((x) => x.toLowerCase()),
  quantity: r.quantity,
  //TODO: Requirements...
})

export const encodeCategory = (category: string): string => {
  return encodeURIComponent(category.toLowerCase().replace(/\s/g, '-'))
}

export const decodeCategory = (category: string): string => {
  return decodeURIComponent(category.toLowerCase().replace(/-/g, ' '))
}

export const stringifyRewardQuery = (query: RewardQuery): string => {
  if (query.category) {
    query.category = query.category.map((x) => encodeCategory(x)).sort()
  }

  return queryString.stringify(query)
}

export const parseRewardQuery = (queryUrl: string): RewardQuery => {
  const query: RewardQuery = queryString.parse(queryUrl, { parseNumbers: true, parseBooleans: true })

  //If only 1 category is returned, then the value will be a string, we need to ensure that it is always an array
  if (query.category && !Array.isArray(query.category)) {
    query.category = [query.category]
  }

  if (query.category) {
    query.category = query.category.map((x) => decodeCategory(x))
  }

  return query
}
