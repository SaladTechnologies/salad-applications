import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UserStatsSummary } from './components/UserStatsSummary'

const mapStoreToProps = (store: RootStore) => {
  let earningRate = 'Loading'

  if (store.native.machineInfo) {
    if (store.machine.currentMachine) {
      if (store.machine.currentEarningRate) {
        earningRate = `$${(store.machine.currentEarningRate * 86400).toFixed(3)}/day`
      } else {
        earningRate = '$0.000/day'
      }
    }
  }

  return {
    earningRate: earningRate,
    miningStatus: store.native.miningStatus,
  }
}

export const UserStatsSummaryContainer = connect(
  mapStoreToProps,
  UserStatsSummary,
)
