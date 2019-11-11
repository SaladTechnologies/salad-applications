import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

const mapStoreToProps = (store: RootStore) => {
  console.log('++---> [[MachineTestcontainer]] store.saladBowl.initializingStatus: ', store.saladBowl.initializingStatus)
  console.log('++---> [[MachineTestcontainer]] store.saladBowl.runningStatus: ', store.saladBowl.runningStatus)
  console.log('++---> [[MachineTestcontainer]] store.saladBowl.earningStatus: ', store.saladBowl.earningStatus)

  return {
  onTestMachine: store.profile.startMachineTest,
  onAbortTest: store.profile.abortMachineTest,
  onRestartTest: store.profile.restartMachineTest,
  onNext: store.profile.onNext,
  pluginName: store.saladBowl.plugin.name,
  pluginStatus: store.saladBowl.plugin.status.toString(),
  errorCategory: store.saladBowl.errorCategory,
  errorMessage: store.saladBowl.errorMessage,

  earningRatePerDay: store.profile.earningRatePerDay,
  rewardsOverTime: store.profile.rewardsOverTime,
  installPath: store.native.installPath,
}}

export const MachineTestContainer = connect(
  mapStoreToProps,
  MachineTest,
)
