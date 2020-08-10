import { encodeCategory } from './modules/reward/utils'

//TODO: Remove this when we move the CMS
/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardCategoryRoute = (category: string): string => {
  //Normalize the category to ensure it is safe to be used as a URL
  let safeCategory = encodeCategory(category)

  //TODO: DRS make this be the correct search url instead
  return `/browse/category/${safeCategory}`
}

/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardRoute = (rewardId?: string): string => {
  return `/rewards/${rewardId}`
}
