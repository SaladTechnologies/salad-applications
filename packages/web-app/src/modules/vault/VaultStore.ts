import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'

import { RewardVaultItem, RewardVaultResource } from './models'

export class VaultStore {
  @observable
  public redemptions: RewardVaultItem[] = []

  constructor(private readonly axios: AxiosInstance) {}

  @action.bound
  loadVault = flow(function*(this: VaultStore) {
    try {
      var response = yield this.axios.get<RewardVaultResource[]>('/api/v1/reward-vault')

      this.redemptions = response.data
        .map(this.rewardVaultFromResource)
        .sort((a: RewardVaultItem, b: RewardVaultItem) => b.timestamp.getTime() - a.timestamp.getTime())
    } catch {}
  })

  rewardVaultFromResource = (r: RewardVaultResource): RewardVaultItem => ({
    id: r.id,
    name: r.name,
    price: r.price,
    timestamp: new Date(r.timestamp),
    code: r.code,
  })
}
