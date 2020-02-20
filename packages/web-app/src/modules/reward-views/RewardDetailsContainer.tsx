import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RewardDetailsPage } from './pages'
import { RouteComponentProps } from 'react-router-dom'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => ({
  reward: store.rewards.getReward(props.match.params.id),
  onBack: store.routing.goBack,
})

export const RewardDetailsContainer = connect(mapStoreToProps, RewardDetailsPage)
