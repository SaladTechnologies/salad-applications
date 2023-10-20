import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { AchievementPage } from './components/AchievementPage'

const mapStoreToProps = (_store: RootStore): any => ({
  // TODD: add store mapping
  // Example: unclaimedBonuses: store.bonuses.unclaimedBonuses,
})

export const AchievementPageContainer = connect(mapStoreToProps, AchievementPage)
