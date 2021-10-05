import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineSettingsPage, MachineSettingsPageProps } from './pages/MachineSettingsPage'

const mapStoreToProps = (store: RootStore): Omit<MachineSettingsPageProps, 'classes'> => ({
  isNative: store.native.isNative,
  desktopSettings: store.machineSettingsUI.desktopSettings,
  workloads: store.machineSettingsUI.workloads,
})

export const MachineSettingsPageContainer = connect(mapStoreToProps, MachineSettingsPage)
