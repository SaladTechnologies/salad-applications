import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { routeLink } from '../../utils'
import { MiningStatus } from '../machine/models'
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

  const status = store.saladBowl.status
  const isRunning =
    status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running
  return {
    categories: store.rewards.categorizedRewards,
    heroes: store.engagement.heroes,
    onClickReward,
    isRunning,
  }
}

export const MainStorefrontContainer = connect(mapStoreToProps, MainStorefrontPage)
