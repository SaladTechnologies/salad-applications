import { RewardVaultStatus } from './RewardVaultStatus'

export interface RewardVaultResource {
  id: string
  name: string
  price: number
  timestamp: string
  code?: string
  status: RewardVaultStatus
}
