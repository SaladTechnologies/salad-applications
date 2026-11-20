import { useAchievements } from '../../account/achievements.ts'
import { config } from '../../config'
import { useHttp } from '../../data/http-context.ts'
import { AchievementPage } from './components/AchievementPage'

/** The achievements page. It loads the account's achievements each time it opens, and passes them to the page. */
export const AchievementPageContainer = () => {
  const achievements = useAchievements(useHttp(), config.apiBaseUrl)
  return <AchievementPage achievements={achievements} />
}
