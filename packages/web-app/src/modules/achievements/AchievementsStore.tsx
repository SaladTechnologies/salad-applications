import type { AxiosInstance } from 'axios'
import { action, observable, runInAction } from 'mobx'
import { config } from '../../config'
import type { Achievement } from './models/Achievement'

export class AchievementsStore {
  @observable
  public achievements: Achievement[] = []

  constructor(private readonly axios: AxiosInstance) {}

  @action
  public getAchievements = async (): Promise<void> => {
    try {
      await this.axios.get('/api/v2/achievements').then((response) =>
        runInAction(() => {
          this.achievements = response.data.map((achievement: Achievement) => {
            return {
              ...achievement,
              badgeImageUrl: `${config.apiBaseUrl}${achievement.badgeImageUrl}`,
            }
          })
        }),
      )
    } catch (error) {
      console.error('Achievements error: ', error)
    }
  }
}
