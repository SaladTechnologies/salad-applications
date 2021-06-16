export enum BonusType {
  Avatar = 'avatar',
  Balance = 'balance',
  EarningRate = 'earningRateMultiplier',
  Reward = 'reward',
  Xp = 'xp',
}

export interface Bonus {
  id: string
  name?: string
  reason?: string
  iconImageUrl?: string
  expiresAt?: Date
  blockType?: BonusType
}
