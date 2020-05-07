import { encodeCategory } from './modules/reward/utils'
import { Reward } from './modules/reward/models'

/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardCategoryRoute = (category: string): string => {
  //Normalize the category to ensure it is safe to be used as a URL
  let safeCategory = encodeCategory(category)

  return `/browse/category/${safeCategory}`
}

/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardRoute = (reward?: Reward): string => {
  return reward ? `/rewards/${reward.id}` : ''
}
