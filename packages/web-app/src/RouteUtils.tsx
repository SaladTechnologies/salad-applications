/**
 * Returns the route to view all rewards in a specific category
 * @param category The category to view
 */
export const rewardRoute = (rewardId?: string): string => {
  return `/store/rewards/${rewardId}`
}
