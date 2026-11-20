export type { Referral } from '../../../account/referrals.ts'

export const getProgressCompletePercentage = (earnedBalance: number, balanceThreshold: number): number =>
  Math.max(0, Math.min(1, earnedBalance / balanceThreshold)) * 100
