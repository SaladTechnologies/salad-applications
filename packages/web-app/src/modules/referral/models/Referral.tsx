import type { ReferralDefinition } from './ReferralDefinition'
import { maximumReferrerBonus } from './ReferralDefinition'

export interface Referral {
  refereeId: string
  referrerId?: string
  code: string
  earnedBalance: number
  referralDefinition?: ReferralDefinition
}

export interface ReferralsReport {
  latestReferrals: Referral[]
  potentialEarnings: number
  referralsCount: number
  totalEarned: number
  updatedAt: string
}

export const completed = (referral: Referral): boolean => {
  if (!referral || !referral.referralDefinition) return false
  return referral.earnedBalance >= referral.referralDefinition.balanceThreshold
}

export const percentComplete = (referral: Referral): number => {
  if (!referral || !referral.referralDefinition || referral.referralDefinition.balanceThreshold === 0) return 0
  return Math.max(0, Math.min(1, referral.earnedBalance / referral.referralDefinition.balanceThreshold))
}

/** The maximum bonus the referrer can earn (USD) */
export const currentEarned = (referral: Referral): number => {
  if (!referral || !referral.referralDefinition) return 0
  return maximumReferrerBonus(referral.referralDefinition) * percentComplete(referral)
}
