import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MachineSettingsPage, MachineSettingsPageProps } from './pages/MachineSettingsPage'

const mapStoreToProps = (store: RootStore): Omit<MachineSettingsPageProps, 'classes'> => ({
  isNative: store.native.isNative,
  onWhitelistWindowsDefender: () => store.native.whitelistWindowsDefender(),
  onDisableSleepMode: store.native.disableSleepMode,
  closeToTrayEnabled: store.native.minimizeToTray,
  onToggleCloseToTray: store.native.toggleMinimizeToTray,
  autoStartEnabled: store.autoStart.autoStart,
  onToggleAutoStart: store.autoStart.toggleAutoStart,
  autoLaunchEnabled: store.native.autoLaunch,
  onToggleAutoLaunch: store.native.toggleAutoLaunch,
  cpuMiningEnabled: store.saladBowl.cpuMiningEnabled,
  gpuMiningEnabled: store.saladBowl.gpuMiningEnabled,
  onSetCPUMiningOnly: () => store.saladBowl.setGpuOnly(false),
  onSetGPUMiningOnly: () => store.saladBowl.setGpuOnly(true),
  onSetGPUAndCPUMining: () => store.saladBowl.setGpuAndCpu(),
  miner: store.machineSettingsUI.minerWorkload,
  cpu: store.machineSettingsUI.cpuProcessorInfo,
  gpus: store.machineSettingsUI.gpuProcessorInfo,
  onShowLogFolder: () => store.native.openFolderLog(),
})

export const MachineSettingsPageContainer = connect(mapStoreToProps, MachineSettingsPage)
