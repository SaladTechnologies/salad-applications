import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineTest } from './components/MachineTest/MachineTest'

const mapStoreToProps = (store: RootStore) => ({})

export const MachineTestContainer = connect(
  mapStoreToProps,
  MachineTest,
)
