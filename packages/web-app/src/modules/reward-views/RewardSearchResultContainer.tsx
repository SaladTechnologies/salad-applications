import { RouteComponentProps } from 'react-router'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { BrowseRewardsPage } from './pages'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps): any => ({
  onBack: store.routing.goBack,
  route: props,
})

export const RewardSearchResultContainer = connect(mapStoreToProps, BrowseRewardsPage)
