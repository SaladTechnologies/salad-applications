import type { RewardVaultStatus } from './RewardVaultStatus'

export interface RewardVaultResource {
  id: string
  name: string
  price: number
  rewardId: string
  timestamp: string
  code?: string
  status: RewardVaultStatus
}
