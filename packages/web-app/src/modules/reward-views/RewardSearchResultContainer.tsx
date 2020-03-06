import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { BrowseRewardsPage } from './pages'
import { RouteComponentProps } from 'react-router'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => ({
  rewards: store.rewards.searchRewards(props.location.search),
  onViewReward: store.ui.showReward,
})

export const RewardSearchResultContainer = connect(mapStoreToProps, BrowseRewardsPage)
