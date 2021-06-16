import { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { NotificationMessage, NotificationMessageCategory } from '../notifications/models'
import { Bonus, BonusType } from './models'

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

        console.log(x.iconImageUrl)
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
      const bonus = this.unclaimedBonuses.find((x) => x.id === bonusId)

      yield this.axios.post(`/api/v2/bonuses/${bonusId}/claim`)

      const notification: NotificationMessage = {
        category: NotificationMessageCategory.BonusClaimedSuccess,
        title: `Claimed ${bonus?.name}!`,
        message: 'Congrats on your new bonus!',
        onClick: () => this.store.routing.push('/bonuses'),
        autoClose: false,
      }

      switch (bonus?.blockType) {
        case BonusType.Avatar:
          notification.message =
            'Congrats on your new bonus! Your item is on its way. Check your profile for more details.'
          notification.onClick = () => this.store.routing.push('/settings/summary')
          break
        case BonusType.Balance:
          break
        case BonusType.EarningRate:
          break
        case BonusType.Reward:
          // NOTE: These should be kept in sync with the notification for successful reward redemptions
          notification.message =
            'Congrats on your pick! Your item is on its way. Check your reward vault for more details.'
          notification.onClick = () => this.store.routing.push('/account/reward-vault')
          break
        case BonusType.Xp:
          break
      }

      //Show a notification
      this.store.notifications.sendNotification(notification)
    } catch (e) {
      console.error(e)
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.BonusClaimedError,
        title: `Uh Oh. Something went wrong.`,
        message: 'Please try to claim the bonus again later',
        autoClose: false,
        type: 'error',
      })
    } finally {
      // Refresh the list of bonuses
      yield this.store.refresh.refreshData()
    }
  })
}
