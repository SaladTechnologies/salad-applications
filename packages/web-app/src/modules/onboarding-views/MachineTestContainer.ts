import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

const mapStoreToProps = (store: RootStore) => {
  // console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Plugin: ', store.saladBowl.plugin.status)
  // console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl ErrorCategory: ', store.saladBowl.errorCategory)
  // console.log(
  //   '>->-> [[MachineTestContainer] mapStoreToProps] store.profile.earningRatePerDay: ',
  //   store.profile.earningRatePerDay,
  // )

  return {
    onTestMachine: store.profile.startMachineTest,
    onAbortTest: store.profile.abortMachineTest,
    onRestartTest: store.profile.restartMachineTest,

    // pluginName: store.saladBowl.plugin.name,
    // pluginStatus: store.saladBowl.plugin.status,
    // errorCategory: store.saladBowl.errorCategory,
    // errorMessage: store.saladBowl.errorMessage,

    pluginName: 'Ethminer',
    pluginStatus: 'running',
    errorCategory: undefined,
    errorMessage: undefined,

    earningRatePerDay: store.profile.earningRatePerDay,
    rewardsOverTime: store.profile.rewardsOverTime,
    installPath: store.native.installPath,
    onNext: store.profile.onNext,
  }
}

export const MachineTestContainer = connect(
  mapStoreToProps,
  MachineTest,
)
