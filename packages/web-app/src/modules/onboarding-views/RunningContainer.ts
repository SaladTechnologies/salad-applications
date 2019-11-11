import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Running } from './components/Running/Running'

const mapStoreToProps = (store: RootStore) => {
  console.log('++---> [[RunningContainer]] store.saladBowl.initializingStatus: ', store.saladBowl.initializingStatus)
  console.log('++---> [[RunningContainer]] store.saladBowl.runningStatus: ', store.saladBowl.runningStatus)
  console.log('++---> [[RunningContainer]] store.saladBowl.earningStatus: ', store.saladBowl.earningStatus)

  return {
    onNext: store.profile.onNext,

    earningRatePerDay: store.profile.earningRatePerDay,
    rewardsOverTime: store.profile.rewardsOverTime,
    initializingStatus: store.saladBowl.initializingStatus,
    runningStatus: store.saladBowl.runningStatus,
    earningStatus: store.saladBowl.earningStatus,
  }
}

export const RunningContainer = connect(
  mapStoreToProps,
  Running,
)
