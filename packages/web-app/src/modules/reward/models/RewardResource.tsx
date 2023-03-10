import type { RewardPlatform } from '.'
import type { RewardRequirements } from './RewardRequirements'

export interface RewardResource {
  /** The unique id for the reward */
  id: string

  /** The display name for the reward */
  name: string

  /** When was the reward released. This should be the game's release date or for non games when it was added to salad */
  releaseDate?: string

  /** When was the reward aded to Salad. */
  addedDate?: string

  /** Developer of the product */
  developerName?: string

  /** Publisher of the product */
  publisherName?: string

  /** Short headline to show when the reward is featured */
  headline?: string

  /** Full description for the reward. (Including html) */
  description: string

  /** Purchase price */
  price: number

  /** MSRP of the reward */
  originalPrice?: number

  /** Main image show on the storefront. Similar to a game box */
  coverImage?: string

  /** The large image that is shown for featured rewards */
  heroImage?: string

  /** @deprecated This has been replaced by several other properties including coverImage and images */
  image?: string

  /** A collection of product images */
  images?: string[]

  /** Platform (eg. Steam...) */
  platform?: RewardPlatform

  /** A collection of tags to categorize the reward */
  tags: string[]

  /** Basic stock information */
  quantity?: number

  /** Requirements to utilize the reward */
  requirements?: RewardRequirements
}
