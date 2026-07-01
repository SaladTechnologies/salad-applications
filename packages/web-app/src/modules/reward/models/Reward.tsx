import type { RewardPlatform } from './RewardPlatform'
import type { RewardRequirements } from './RewardRequirements'

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

  /**
   * The token/unit value the reward grants. A RENDER reward's Salad Balance cost is always its plain {@link price}
   * (shown like any other reward); the number of RENDER tokens a Chef receives for that cost is derived at display
   * time from the live RENDER/USD exchange rate (`price / rate`), not from this field.
   */
  productValue?: number

  /** MSRP of the reward */
  originalPrice?: number

  /** Main image show on the storefront. Similar to a game box */
  coverImage?: string

  /** The large hero image. */
  heroImage?: string

  /** @deprecated This has been replaced by several other properties including coverImage and images */
  image?: string

  /** A collection of product images */
  images?: Array<string | undefined>

  /** A collection of product videos */
  videos?: string[]

  /** Platform (eg. Steam) */
  platform?: RewardPlatform
  checkoutTerms?: string[]
  tags: string[]

  /** The quantity of rewards remaining.
   *  A value means stock is getting low.
   *  Undefined means we have "significant" stock */
  quantity?: number

  /** Requirements to utilize the reward */
  requirements?: RewardRequirements
}
