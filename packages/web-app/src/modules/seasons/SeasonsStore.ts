import { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { action, computed, flow, observable } from 'mobx'
import { CurrentSeason, Level } from './models'

export class SeasonsStore {
  /** The Current Season */
  @observable
  private currentSeason: CurrentSeason | undefined

  @observable
  private testNow: any = DateTime.now()

  @observable
  private testStart: any = DateTime.now().minus({ days: 4, hours: 2 })

  @observable
  private testEnd: any = DateTime.now().minus({ days: 0, hours: 4 })

  @computed
  get duration(): string {
    if (this.currentSeason?.startAbsolute && this.currentSeason.startAbsolute) {
      const startDateTime = this.testStart
      const endDateTime = this.testEnd

      if (!startDateTime || !endDateTime) return ''

      return startDateTime.monthShort + ' ' + startDateTime.day + ' - ' + endDateTime.monthShort + ' ' + endDateTime.day
    } else {
      return ''
    }
  }

  @computed
  get timeLeft(): string {
    const now = DateTime.now()

    console.log(this.testNow, 'now')
    console.log(this.testStart, 'teststart')
    console.log(this.testEnd, 'testEnd')

    // console.log(this.testEnd, '4')

    if (!this.currentSeason || !this.currentSeason.startAbsolute || !this.currentSeason.endAbsolute) {
      return ''
    } else if (now < this.testStart) {
      const endDate = this.testStart

      const timeDifference = endDate.diff(now, ['years', 'months', 'days', 'hours'])
      const timeDifferenceObject = timeDifference.toObject()
      debugger
      const hourPluralForm = timeDifferenceObject.hours && timeDifferenceObject.hours <= 1 ? 'hour' : 'hours'
      const dayPluralForm = timeDifferenceObject.days && timeDifferenceObject.days <= 1 ? 'day' : 'days'
      const timeRemaining = timeDifference.days
        ? `Starts in ${Math.floor(timeDifferenceObject.days || 0)} ${dayPluralForm}`
        : timeDifferenceObject.hours
        ? `Starts in ${Math.floor(timeDifferenceObject.hours || 0)} ${hourPluralForm}`
        : ''
      return timeRemaining
    } else if (now > this.testEnd) {
      const completedOn = `Completed on ${this.testEnd.toLocaleString(DateTime.DATE_MED)}`
      return completedOn
    } else {
      const endDate = this.testEnd

      const timeDifference = endDate.diff(now, ['days', 'hours'])
      const timeDifferenceObject = timeDifference.toObject()

      const dayPluralForm = timeDifferenceObject.days && timeDifferenceObject.days <= 1 ? 'day' : 'days'
      const timeRemaining = dayPluralForm ? `${timeDifferenceObject.days} ${dayPluralForm} remaining` : ''
      return timeRemaining
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

  @computed
  get currentLevelXP(): number {
    return this.currentSeason?.levelXp || 0
  }

  @computed
  get nextLevel(): number {
    return this.currentSeason?.nextLevelId || 0
  }

  constructor(private readonly axios: AxiosInstance) {}

  /** (Re)Loads the current season data */
  @action.bound
  loadCurrentSeason = flow(function* (this: SeasonsStore) {
    try {
      let res = yield this.axios.get('/api/v2/seasons/current')

      let data = res?.data

      data.startAbsolute = DateTime.fromISO(data?.startAbsolute)
      data.endAbsolute = DateTime.fromISO(data?.endAbsolute)

      this.currentSeason = data
    } catch (error) {
      console.error(error)
    }
  })
}
