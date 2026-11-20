import { useAchievementsLoad } from '../../account/achievements.ts'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { AchievementPage } from './components/AchievementPage'

const mapStoreToProps = (store: RootStore): any => ({
  achievements: store.achievements.achievements,
})

const ConnectedAchievementPage = connect(mapStoreToProps, AchievementPage)

/** The achievements page. It loads the account's achievements each time it opens; they stay in the store. */
export const AchievementPageContainer = () => {
  useAchievementsLoad(getStore().achievements.getAchievements)
  return <ConnectedAchievementPage />
}
