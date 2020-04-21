import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { BrowseRewardsPage } from './pages'
import { RouteComponentProps } from 'react-router-dom'
import { decodeCategory } from '../reward/utils'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ category: string }>): any => ({
  title: decodeCategory(props.match.params.category),
  rewards: store.rewards.getRewardsByCategory(decodeCategory(props.match.params.category), props.location.search),
  onBack: store.routing.goBack,
  onViewReward: store.rewards.viewReward,
  location: props.location,
})

export const RewardBrowseCategoryContainer = connect(mapStoreToProps, BrowseRewardsPage)
