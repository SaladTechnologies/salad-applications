import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CurrentSeasonPage } from './pages/CurrentSeasonPage'

const mapStoreToProps = (store: RootStore): any => ({
  duration: store.seasons.duration,
  levels: store.seasons.levels,
  timeLeft: store.seasons.timeLeft,
  totalXP: store.seasons.totalXP,
})

export const CurrentSeasonPageContainer = connect(mapStoreToProps, CurrentSeasonPage)
