import { RewardCategory } from './RewardCategory'
import { RewardPlatform } from './RewardPlatform'
import { RewardRequirements } from './RewardRequirements'

export interface Reward {
  id: string

  /** The display name for the reward */
  name: string

  /** When was the reward released. This should be the game's release date or for non games when it was added to salad */
  releaseDate?: Date

  /** When was the reward aded to Salad. */
  addedDate?: Date

  /** Developer of the product */
  developerName?: string

  /** Publisher of the product */
  publisherName?: string

  /** Short headline to show when the reward is featured */
  headline?: string

  /** Full description for the reward */
  description?: string

  /** Purchase price */
  price: number

  /** Main image show on the storefront. Similar to a game box */
  coverImage?: string

  /** The large hero image. */
  heroImage?: string

  /** @deprecated This has been replaced by several other properties including coverImage and images */
  image?: string

  /** A collection of product images */
  images?: string[]

  /** A collection of product videos */
  videos?: string[]

  /** Platform (eg. Steam) */
  platform?: RewardPlatform
  category: RewardCategory
  checkoutTerms?: string[]
  tags: string[]
  redeemable: boolean
  /** How much of the reward has already been unlocked (0-1) */
  percentUnlocked: number
  remainingTimeLabel: string

  /** The quantity of rewards remaining.
   *  A value means stock is getting low.
   *  Undefined means we have "significant" stock */
  quantity?: number

  /** Requirements to utilize the reward */
  requirements?: RewardRequirements
}
