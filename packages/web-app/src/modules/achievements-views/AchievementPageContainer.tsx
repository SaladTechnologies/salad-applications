import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { AchievementPage } from './components/AchievementPage'

const mapStoreToProps = (store: RootStore): any => ({
  getAchievements: store.achievements.getAchievements,
  achievements: store.achievements.achievements,
})

export const AchievementPageContainer = connect(mapStoreToProps, AchievementPage)
