import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineInfoPanel } from './components/MachineInfoPanel'

const mapStoreToProps = (store: RootStore): any => ({
  gpuEnabled: store.saladBowl.gpuMiningEnabled,
  cpuEnabled: store.saladBowl.cpuMiningEnabled,
  gpus: store.machine.gpus,
  cpu: store.native.machineInfo?.cpu,
  ram: store.native.machineInfo?.memLayout,
  cpuCompatible: store.machine.cpuCompatible,
})

export const MachineInfoContainer = connect(mapStoreToProps, MachineInfoPanel)
