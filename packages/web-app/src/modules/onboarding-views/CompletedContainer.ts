import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Completed } from './components/Completed/Completed'

const mapStoreToProps = (store: RootStore) => {
  return {
    onNext: store.profile.onNext,

    earningRatePerDay: store.profile.earningRatePerDay,
    rewardsOverTime: store.profile.rewardsOverTime,
  }
}

export const CompletedContainer = connect(mapStoreToProps, Completed)
