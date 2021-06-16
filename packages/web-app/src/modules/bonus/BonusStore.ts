import { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { Bonus } from './models'

export class BonusStore {
  /** A collection of all unclaimed bonuses */
  @observable
  public unclaimedBonuses: Bonus[] = []

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  /** (Re)Loads all bonuses */
  @action.bound
  loadBonuses = flow(function* (this: BonusStore) {
    try {
      let res = yield this.axios.get('/api/v2/bonuses')

      let data = res.data as Bonus[]

      data.forEach((x) => {
        // @ts-ignore This data comes in as a string, so we can safely ignore the types since this is parsing it
        const timeString: string = x.expiresAt
        x.expiresAt = DateTime.fromISO(timeString).toJSDate()
      })

      this.unclaimedBonuses = data
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  @action.bound
  claimBonus = flow(function* (this: BonusStore, bonusId: string) {
    console.log('Claiming bonus ' + bonusId)

    try {
      yield this.axios.post(`/api/v2/bonuses/${bonusId}/claim`)
    } catch (e) {
      console.error(e)
    } finally {
      // Refresh the list of bonuses
      yield this.store.refresh.refreshData()
    }
  })
}
