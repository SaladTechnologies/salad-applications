import type { AxiosInstance } from 'axios'
import { pick } from 'lodash'
import { action, computed, flow, observable } from 'mobx'
import type { Reward } from '../reward/models'
import type {
  StorefrontHeroBlockProps,
  StorefrontHeroItemProps,
  StorefrontPageProps,
  StorefrontRewardBlockProps,
  StorefrontRewardItemProps,
} from './models'
import { StorefrontBlockComponent } from './models'
import type { StorefrontResource } from './models/StorefrontResource'

export class StorefrontStore {
  private rewards: Record<string, StorefrontRewardItemProps> = {}

  @observable
  private storefrontData?: StorefrontPageProps

  @observable
  public isLoading: boolean = false

  @computed get data(): any {
    return this.storefrontData
  }

  constructor(private readonly axios: AxiosInstance) {}

  @action.bound
  refreshStorefront = flow(function* (this: StorefrontStore) {
    try {
      this.isLoading = true

      const response = yield this.axios.get<StorefrontResource>('/api/v2/storefront')
      if (response.data === undefined) return

      this.storefrontData = response.data
      this.setRewards(this.storefrontData)
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  })

  private setRewards = (storefrontItems?: StorefrontPageProps) => {
    let rewards: Record<string, StorefrontRewardItemProps> = {}

    storefrontItems &&
      storefrontItems?.blocks.forEach((block) => {
        if (block.__component === StorefrontBlockComponent.Hero) {
          const heroBlock = block as StorefrontHeroBlockProps
          heroBlock.items.forEach((item: StorefrontHeroItemProps) => {
            if (item.reward) {
              rewards[item.reward.uuid] = item.reward
            }
          })
        }

        if (block.__component === StorefrontBlockComponent.Reward) {
          const rewardBlock = block as StorefrontRewardBlockProps
          rewardBlock.rewards.forEach((reward: StorefrontRewardItemProps) => {
            if (reward) {
              rewards[reward.uuid] = reward
            }
          })
        }
      })

    this.rewards = rewards
  }

  public checkRewardForUpdate(loadedReward?: Reward) {
    let refreshStore: boolean = false

    if (this.rewards === undefined || loadedReward === undefined) {
      return
    }

    if (this.rewards.hasOwnProperty(loadedReward.id)) {
      const pickedStorefrontReward = pick(this.rewards[loadedReward.id], ['price', 'quantity'])
      const pickedLoadedReward = pick(loadedReward, ['price', 'quantity'])
      if (pickedLoadedReward.quantity === undefined) {
        // Strapi doesn't allow for undefined values, so -1 is used
        // to identify a reward that is not low in quantity
        pickedLoadedReward.quantity = -1
      }

      if (JSON.stringify(pickedStorefrontReward) !== JSON.stringify(pickedLoadedReward)) {
        refreshStore = true
      }
    }

    if (refreshStore) {
      this.refreshStorefront()
    }
  }
}
