import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

const mapStoreToProps = (store: RootStore) => ({
  onTestMachine: store.profile.startMachineTest
})

export const MachineTestContainer = connect(
  mapStoreToProps,
  MachineTest,
)
