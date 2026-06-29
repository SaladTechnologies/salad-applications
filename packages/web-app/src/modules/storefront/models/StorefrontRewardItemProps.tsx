export interface StorefrontRewardItemProps {
  id: string
  name: string
  uuid: string
  price: number
  /** The reward's tags (lower-cased), used to identify RENDER rewards for pricing. */
  tags?: string[]
  /** For RENDER rewards, the number of RENDER tokens granted; drives the displayed price. */
  productValue?: number
  originalPrice?: number
  inStock: boolean
  quantity: number
  created_at: string
  updated_at: string
  coverImage: string
  heroImage: string
}
