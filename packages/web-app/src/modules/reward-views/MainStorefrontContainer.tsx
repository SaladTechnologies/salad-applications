import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { routeLink } from '../../utils'
import { MainStorefrontPage } from './pages'

const mapStoreToProps = (store: RootStore): any => {
  const onClickReward = (to: string, action?: any) => {
    if (action) {
      action()
      routeLink(store, to)
    } else {
      routeLink(store, to)
    }
  }
  return {
    categories: store.rewards.categorizedRewards,
    heroes: store.engagement.heroes,
    onClickReward,
  }
}

export const MainStorefrontContainer = connect(mapStoreToProps, MainStorefrontPage)
