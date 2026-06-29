import type { Reward } from '.'
import { rewardRoute } from '../../../RouteUtils'

export class SearchResult {
  /** The quantity of rewards remaining.
   *  A value means stock is getting low.
   *  Undefined means we have "significant" stock */

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly url: string,
    public readonly image?: string,
    public readonly heroImage?: string,
    public readonly description?: string,
    public readonly quantity?: number,
    public readonly originalPrice?: number,
    /** The reward's tags (lower-cased), used to identify RENDER rewards for pricing. */
    public readonly tags?: string[],
    /** For RENDER rewards, the number of RENDER tokens granted; drives the displayed price. */
    public readonly productValue?: number,
  ) {}

  /** Normalizes the raw `tags` field from the search index into a lower-cased string array. */
  private static parseTags = (raw: unknown): string[] | undefined => {
    if (Array.isArray(raw)) {
      return raw.map((tag) => String(tag).toLowerCase())
    }
    if (typeof raw === 'string' && raw.length > 0) {
      return raw.split(',').map((tag) => tag.trim().toLowerCase())
    }
    return undefined
  }

  public static parseSearchResult = (result: any): SearchResult => {
    const id = result['id'].raw
    const name = result['name'].raw
    const price = parseFloat(result['price'].raw)
    let originalPrice: number | undefined = result['original_price']?.raw
      ? parseFloat(result['original_price']?.raw)
      : undefined
    const image = result['cover_image']?.raw
    let quantity: number | undefined = parseInt(result['quantity']?.raw)
    const inStock = result['in_stock']?.raw === 'true'
    const url = rewardRoute(id)
    const tags = SearchResult.parseTags(result['tags']?.raw)
    const productValue: number | undefined =
      result['product_value']?.raw !== undefined ? parseFloat(result['product_value'].raw) : undefined

    if (!inStock) {
      quantity = 0
    } else if (quantity > 0) {
    } else {
      quantity = undefined
    }

    return new SearchResult(
      id,
      name,
      price,
      url,
      image,
      undefined,
      undefined,
      quantity,
      originalPrice,
      tags,
      Number.isFinite(productValue as number) ? productValue : undefined,
    )
  }

  public static fromReward = (reward: Reward): SearchResult => {
    return new SearchResult(
      reward.id,
      reward.name,
      reward.price,
      rewardRoute(reward.id),
      reward.coverImage,
      reward.heroImage,
      reward.headline,
      reward.quantity,
      reward.originalPrice,
      reward.tags,
      reward.productValue,
    )
  }
}
