import { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { NotificationMessage, NotificationMessageCategory } from '../notifications/models'
import { Bonus, BonusEarningRate, BonusType } from './models'

export class BonusStore {
  /** A collection of all unclaimed bonuses */
  @observable
  public unclaimedBonuses: Bonus[] = []

  /** A collection of bonus ids that are pending being claimed */
  @observable
  public pendingBonuses = new Set<string>()

  @observable
  public currentEarningBonus: BonusEarningRate | undefined

  @observable
  public replacementEarningRateBonusId?: string

  @observable
  private replaceEarningRate: boolean = false

  @computed
  get firstExpiringUnclaimedBonus(): Bonus | undefined {
    return this.unclaimedBonuses.length > 0 ? this.unclaimedBonuses[0] : undefined
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  /** (Re)Loads the current active bonuses */
  loadBonuses = () => {
    this.loadEarningRates()
    this.loadUnclaimedBonuses()
  }

  /** (Re)Loads the active earning rate bonuses */
  @action.bound
  loadEarningRates = flow(function* (this: BonusStore) {
    try {
      let res = yield this.axios.get('/api/v2/bonuses/earning-rate')

      this.currentEarningBonus = res.data
    } catch (error) {
      this.currentEarningBonus = undefined
      console.error(error)
    }
  })

  /** (Re)Loads all unclaimed bonuses */
  @action.bound
  loadUnclaimedBonuses = flow(function* (this: BonusStore) {
    try {
      let res = yield this.axios.get('/api/v2/bonuses')

      let data = res.data as Bonus[]

      const sortByDate = (a: Bonus, b: Bonus): number => {
        if (a.expiresAt && b.expiresAt) {
          return DateTime.fromJSDate(a.expiresAt).startOf('day') < DateTime.fromJSDate(b.expiresAt).startOf('day')
            ? -1
            : 1
        } else {
          return a.name && b.name ? a.name.localeCompare(b.name) : 0
        }
      }

      data.forEach((x) => {
        // @ts-ignore This data comes in as a string, so we can safely ignore the types since this is parsing it
        const timeString: string = x.expiresAt
        x.expiresAt = DateTime.fromISO(timeString).toJSDate()

        console.log(x.iconImageUrl)
      })

      const sortedBonuses = data.sort(sortByDate)

      this.unclaimedBonuses = sortedBonuses
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  @action.bound
  claimBonus = flow(function* (this: BonusStore, bonusId: string) {
    console.log('Claiming bonus ' + bonusId)

    if (this.pendingBonuses.has(bonusId)) {
      console.warn('Bonus is already being claimed')
      return
    }

    try {
      const bonus = this.unclaimedBonuses.find((x) => x.id === bonusId)

      if (!bonus) throw Error('Bonus not found')

      // Check to see if we are overriding a current earning rate bonus
      if (
        bonus.blockType === BonusType.EarningRate &&
        this.currentEarningBonus !== undefined &&
        !this.replaceEarningRate
      ) {
        this.replacementEarningRateBonusId = bonus.id
        this.store.ui.showModal('/bonuses/replace-bonus')
        return
      }

      // Mark the reward as pending
      this.pendingBonuses.add(bonusId)

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
          notification.message = 'Your bonus earning rate is now active. Check your earnings for more details.'
          notification.onClick = () => this.store.routing.push('/earn/summary')
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

      this.pendingBonuses.delete(bonusId)
      this.replaceEarningRate = false
    }
  })

  @action
  public clearReplacementEarningRateBonusId = () => {
    this.replacementEarningRateBonusId = undefined
  }

  @action
  public replaceCurrentEarningRate = () => {
    if (this.replacementEarningRateBonusId) {
      this.replaceEarningRate = true
      this.claimBonus(this.replacementEarningRateBonusId)
    }
  }
}
