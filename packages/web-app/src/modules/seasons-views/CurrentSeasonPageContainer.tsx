import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { CurrentSeasonPage } from './pages/CurrentSeasonPage'

const mapStoreToProps = (store: RootStore): any => ({
  duration: store.seasons.duration,
  levels: store.seasons.levels,
  timeLeft: store.seasons.timeLeft,
  totalXP: store.seasons.totalXP,
  currentLevelXP: store.seasons.currentLevelXP,
  nextLevel: store.seasons.nextLevel,
})

export const CurrentSeasonPageContainer = connect(mapStoreToProps, CurrentSeasonPage)
