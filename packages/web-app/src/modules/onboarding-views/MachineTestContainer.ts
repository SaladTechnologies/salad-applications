import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

// let count = 0

const mapStoreToProps = (store: RootStore) => {
  console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Plugin: ', store.saladBowl.plugin.status)
  console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl ErrorCategory: ', store.saladBowl.errorCategory)
  console.log(
    '>->-> [[MachineTestContainer] mapStoreToProps] store.profile.earningRatePerDay: ',
    store.profile.earningRatePerDay,
  )

  return {
    onTestMachine: store.profile.startMachineTest,
    onAbortTest: store.profile.abortMachineTest,
    onRestartTest: store.profile.restartMachineTest,
    pluginName: store.saladBowl.plugin.name,
    pluginStatus: store.saladBowl.plugin.status,
    errorCategory: store.saladBowl.errorCategory,
    errorMessage: store.saladBowl.errorMessage,
    earningRatePerDay: store.profile.earningRatePerDay,
    rewardsOverTime: store.profile.rewardsOverTime,
    // pluginName: 'Ethminer', //store.saladBowl.plugin.name,
    // pluginStatus: 'stopped', //store.saladBowl.plugin.status,
    // errorCategory: 'antiVirus', //store.saladBowl.error,
    // errorMessage: 'Antivirus removed the miner',
    installPath: store.native.installPath,
  }
}

// const mapStoreToProps = (store: RootStore) => ({
//   onTestMachine: store.profile.startMachineTest,
//   plugin: store.saladBowl.plugin,
//   error: store.saladBowl.error,
// })

export const MachineTestContainer = connect(
  mapStoreToProps,
  MachineTest,
)
