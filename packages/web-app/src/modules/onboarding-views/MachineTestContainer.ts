import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

const mapStoreToProps = (store: RootStore) => ({
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
})

export const MachineTestContainer = connect(mapStoreToProps, MachineTest)
