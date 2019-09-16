export interface ReferralDefinition {
  balanceThreshold: number
  bonusRate: number
  referrerBonus: number
}

export const maximumReferrerBonus = (referralDefinition: ReferralDefinition): number =>
  referralDefinition.balanceThreshold * referralDefinition.referrerBonus
