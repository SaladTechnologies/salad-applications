import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { SelectTargetRewardPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  // * NOTE: Should be replaced with real data when backend is ready
  targetRewards: [],
  onConfirmTargetReward: store.rewards.setSelectedTargetReward,
})

export const SelectTargetRewardContainer = connect(mapStoreToProps, SelectTargetRewardPage)
