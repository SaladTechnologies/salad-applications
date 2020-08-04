import { RouteComponentProps } from 'react-router-dom'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { decodeCategory } from '../reward/utils'
import { BrowseRewardsPage } from './pages'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ category: string }>): any => ({
  title: decodeCategory(props.match.params.category),
  // rewards: store.rewards.getRewardsByUrl(props),
  onBack: store.routing.goBack,
  route: props,
})

export const RewardBrowseCategoryContainer = connect(mapStoreToProps, BrowseRewardsPage)
