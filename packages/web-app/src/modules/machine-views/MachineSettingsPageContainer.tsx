import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineSettingsPage, MachineSettingsPageProps } from './pages/MachineSettingsPage'

const mapStoreToProps = (store: RootStore): Omit<MachineSettingsPageProps, 'classes'> => {
  // component isn't connected yet, with new ui. The console log prevents a build failure.
  console.log(store)
  return {
    desktopSettings: [],
    workloads: [],
  }
}

export const MachineSettingsPageContainer = connect(mapStoreToProps, MachineSettingsPage)
