import { Reward } from '.'
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
  ) {}

  public static parseSearchResult = (result: any): SearchResult => {
    const id = result['id'].raw
    const name = result['name'].raw
    const price = parseFloat(result['price'].raw)
    let originalPrice: number | undefined = parseFloat(result['original_price']?.raw)
    const image = result['cover_image']?.raw
    let quantity: number | undefined = parseInt(result['quantity']?.raw)
    const inStock = result['in_stock']?.raw === 'true'
    const url = rewardRoute(id)

    if (!inStock) {
      quantity = 0
    } else if (quantity > 0) {
    } else {
      quantity = undefined
    }

    if (isNaN(originalPrice)) {
      originalPrice = undefined
    }
    return new SearchResult(id, name, price, url, image, undefined, undefined, quantity, originalPrice)
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
    )
  }
}
