import { action, observable, computed } from 'mobx'
import { Level } from './models/Level'
import { defaultLevels } from './models/defaultLevels'

export class ExperienceStore {
  @observable
  public currentXp: number = 0

  @observable
  public levels: Level[] = []

  @computed get currentLevel(): Level {
    let matchingLevel = this.levels.find(l => {
      return this.currentXp >= l.minXp && this.currentXp <= l.maxXp
    })

    if (matchingLevel == undefined) matchingLevel = this.levels[this.levels.length - 1]

    return matchingLevel
  }

  @computed get currentPercentComplete(): number {
    const level = this.currentLevel
    let totalRange = level.maxXp - level.minXp
    let delta = this.currentXp - level.minXp
    return delta / totalRange
  }

  constructor() {
    this.loadInitialLevels()
  }

  @action loadInitialLevels() {
    this.levels = defaultLevels
  }

  @action
  updateXp(newXp: number) {
    //TODO: Fix this
    // this.currentXp = newXp
    this.currentXp = this.currentXp + 1
  }
}
