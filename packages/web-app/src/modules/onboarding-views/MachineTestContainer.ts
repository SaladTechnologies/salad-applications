import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'


const mapStoreToProps = (store: RootStore) => {
  setInterval(() => {
    console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Plugin: ', store.saladBowl.plugin.status)
    console.log('>->-> [[MachineTestContainer] mapStoreToProps] saladBowl Error: ', store.saladBowl.error)
  }, 6000)

  return {
    onTestMachine: store.profile.startMachineTest,
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
