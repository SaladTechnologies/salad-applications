//TODO: Remove this when we move the CMS

/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardCategoryRoute = (category: string): string => {
  //Normalize the category to ensure it is safe to be used as a search URL
  category = category.replace(/^\w|\s\w/g, (c) => c.toUpperCase())

  let safeCategory = encodeURIComponent(category)

  return `/search?size=n_20_n&filters%5B0%5D%5Bfield%5D=tags&filters%5B0%5D%5Bvalues%5D%5B0%5D=${safeCategory}&filters%5B0%5D%5Btype%5D=all`
}

/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardRoute = (rewardId?: string): string => {
  return `/rewards/${rewardId}`
}
