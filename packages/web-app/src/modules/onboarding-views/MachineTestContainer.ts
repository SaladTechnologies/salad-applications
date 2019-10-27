import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'


const mapStoreToProps = (store: RootStore) => {
  console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Plugin: ', store.saladBowl.plugin.status)
  console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Error: ', store.saladBowl.error)

  return {
    onTestMachine: store.profile.startMachineTest,
    onAbortTest: store.profile.abortMachineTest,
    pluginName: 'Ethminer', //store.saladBowl.plugin.name,
    pluginStatus: 'stopped', //store.saladBowl.plugin.status,
    errorCategory: 'antiVirus', //store.saladBowl.error,
    errorMessage: 'Antivirus removed the miner',
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
