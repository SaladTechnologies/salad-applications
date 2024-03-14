export interface ReferralDefinition {
  balanceThreshold: number
  bonusRate: number
  referrerBonus: number
  referrerBonusThreshold: number
}

export interface Referral {
  refereeId: string
  referrerId?: string
  code: string
  earnedBalance: number
  referralDefinition?: ReferralDefinition
  referrerEarnedBalance: number
}

export interface ReferralsReport {
  latestReferrals: Referral[]
  potentialEarnings: number
  referralsCount: number
  totalEarned: number
  updatedAt: string
}

export const getProgressCompletePercentage = (earnedBalance: number, balanceThreshold: number): number =>
  Math.max(0, Math.min(1, earnedBalance / balanceThreshold)) * 100
