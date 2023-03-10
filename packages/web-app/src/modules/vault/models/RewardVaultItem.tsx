import type { RewardVaultStatus } from './RewardVaultStatus'

export interface RewardVaultItem {
  id: string
  name: string
  price: number
  timestamp: Date
  code?: string
  status: RewardVaultStatus
}
