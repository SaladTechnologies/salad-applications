import { RewardCategory } from './RewardCategory'

export interface RewardResource {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: RewardCategory
  checkoutTerms: string[]
  tags: string[]
  quantity?: number
}
