import { AxiosInstance } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { defaultLevels, totalXpRequiredForAllVegies } from './models/defaultLevels'
import { Level } from './models/Level'

export class ExperienceStore {
  @observable
  public currentXp: number = 0

  @observable
  public levels: Level[] = []

  @computed get currentLevel(): Level {
    let matchingLevel = this.levels.find((l) => {
      return this.currentXp > l.minXp && this.currentXp <= l.maxXp
    })

    if (matchingLevel === undefined) matchingLevel = this.levels[this.levels.length - 1]

    return matchingLevel
  }

  @computed get currentPercentComplete(): number {
    if (this.currentXp >= totalXpRequiredForAllVegies) {
      return 1
    }

    const level = this.currentLevel
    let totalRange = level.maxXp - level.minXp
    let delta = this.currentXp - level.minXp
    return delta / totalRange
  }

  constructor(readonly axios: AxiosInstance) {
    this.loadInitialLevels()
  }

  @action loadInitialLevels() {
    this.levels = defaultLevels()
  }

  @action
  updateXp(newXp: number) {
    this.currentXp = newXp
  }

  @action.bound
  refreshXp = flow(function* (this: ExperienceStore) {
    try {
      let res = yield this.axios.get('/api/v1/profile/xp')

      let newXp = res.data.lifetimeXp

      this.updateXp(newXp)
    } catch {}
  })
}
