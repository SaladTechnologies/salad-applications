import { rewardRoute } from '../../../RouteUtils'

export class SearchResult {
  /** The quantity of rewards remaining.
   *  A value means stock is getting low.
   *  Undefined means we have "significant" stock */
  quantity?: number

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly image?: string,
    public readonly url?: string,
  ) {}

  public static parseSearchResult = (result: any): SearchResult => {
    console.log(result)
    const id = result['id'].raw
    const name = result['name'].raw
    const price = parseFloat(result['price'].raw)
    const image = result['cover_image'].raw
    const url = rewardRoute(id)
    console.error(image)
    return new SearchResult(id, name, price, image, url)
  }
}
