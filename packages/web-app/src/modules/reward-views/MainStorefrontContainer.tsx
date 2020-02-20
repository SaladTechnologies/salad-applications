import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MainStorefrontPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  categories: store.rewards.categorizedRewards,
  onViewReward: store.ui.showReward,
})

export const MainStorefrontContainer = connect(mapStoreToProps, MainStorefrontPage)
