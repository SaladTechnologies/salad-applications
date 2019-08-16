export class ReferralDefinition {
  balanceThreshold: number = 0
  bonusRate: number = 0
  referrerBonus: number = 0

  /** The maximum bonus the referrer can earn (USD) */
  get maximumReferrerBonus(): number {
    return this.balanceThreshold * this.referrerBonus
  }

  public constructor(init?: Partial<ReferralDefinition>) {
    Object.assign(this, init)
  }
}
