import { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { action, computed, flow, observable } from 'mobx'
import { CurrentSeason, Level } from './models'

export class SeasonsStore {
  /** The Current Season */
  @observable
  private currentSeason: CurrentSeason | undefined

  @computed
  get duration(): string {
    if (this.currentSeason?.startAbsolute && this.currentSeason.startAbsolute) {
      const startDateTime = DateTime.fromISO(this.currentSeason?.startAbsolute)
      const endDateTime = DateTime.fromISO(this.currentSeason.startAbsolute)
      return startDateTime.monthShort + ' ' + startDateTime.day + ' - ' + endDateTime.monthShort + ' ' + endDateTime.day
    } else {
      return ''
    }
  }

  @computed
  get timeLeft(): string {
    if (this.currentSeason?.endAbsolute) {
      const startDate = DateTime.now()
      const endDate = DateTime.fromISO(this.currentSeason?.endAbsolute)

      const timeDifference = startDate.diff(endDate, ['years', 'months', 'days', 'hours'])
      const timeDifferenceObject = timeDifference.toObject()

      const dayPluralForm = timeDifferenceObject.days && timeDifferenceObject.days <= 1 ? 'day' : 'days'
      const timeRemaining = dayPluralForm ? `${timeDifferenceObject.days} ${dayPluralForm} remaining` : ''
      return timeRemaining
    } else {
      return ''
    }
  }

  @computed
  get totalXP(): number {
    return this.currentSeason?.totalXp || 0
  }

  @computed
  get levels(): Level[] | [] {
    return this.currentSeason?.levels || []
  }

  constructor(private readonly axios: AxiosInstance) {}

  /** (Re)Loads the current season data */
  @action.bound
  loadCurrentSeason = flow(function* (this: SeasonsStore) {
    try {
      let res = yield this.axios.get('/api/v2/seasons/current')

      let data = res?.data as CurrentSeason

      this.currentSeason = data
    } catch (error) {
      console.error(error)
    }
  })
}
