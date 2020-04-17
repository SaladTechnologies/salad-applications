export interface RewardQuery {
  /** The search text */
  q?: string

  /** Is the reward available (In stock) */
  available?: boolean

  /** Is the reward currently redeemable by the user */
  redeemable?: boolean

  category?: string[]
}
