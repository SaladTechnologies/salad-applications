import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MainStorefrontPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  categories: store.rewards.categorizedRewards,
})

export const MainStorefrontContainer = connect(mapStoreToProps, MainStorefrontPage)
