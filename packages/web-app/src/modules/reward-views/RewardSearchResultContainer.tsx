import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { BrowseRewardsPage } from './pages'
import { RouteComponentProps } from 'react-router'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps): any => ({
  rewards: store.rewards.searchRewards(props.location.search),
  onViewReward: store.rewards.viewReward,
  onBack: store.routing.goBack,
  route: props,
})

export const RewardSearchResultContainer = connect(mapStoreToProps, BrowseRewardsPage)
