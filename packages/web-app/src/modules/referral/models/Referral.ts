import { ReferralDefinition } from './ReferralDefinition'

export class Referral {
  refereeId: string = ''
  referrerId?: string = ''
  code: string = ''
  earnedBalance: number = 0
  referralDefinition?: ReferralDefinition
  // dateEntered TODO:

  get completed(): boolean {
    if (!this.referralDefinition) return false
    return this.earnedBalance >= this.referralDefinition.balanceThreshold
  }

  get percentComplete(): number {
    if (!this.referralDefinition) return 0
    return Math.max(0, Math.min(1, this.earnedBalance / this.referralDefinition.balanceThreshold))
  }

  /** The maximum bonus the referrer can earn (USD) */
  get currentEarned(): number {
    if (!this.referralDefinition) return 0
    return this.referralDefinition.maximumReferrerBonus * this.percentComplete
  }

  public constructor(init?: Partial<Referral>) {
    Object.assign(this, init)
  }
}
