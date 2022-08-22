import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntivirusSetting } from './settings/AntivirusSetting'

const mapStoreToProps = (store: RootStore): any => ({
  detectedAV: store.onboardingAntivirus.detectedAV,
  onViewAVGuide: store.machineSettingsUI.onViewAVArticle,
  onViewAVList: () => store.ui.showModal('/errors/anti-virus'),
  onWhitelistWindowsDefender: store.native.canWhitelistWindowsDefenderAndDisableSleepMode
    ? store.machineSettingsUI.whitelistWindowsDefender
    : undefined,
  whitelistWindowsDefenderErrorMessage: store.machineSettingsUI.whitelistWindowsDefenderErrorMessage,
  whitelistWindowsDefenderPending: store.machineSettingsUI.whitelistWindowsDefenderPending,
})

export const AntivirusSettingContainer = connect(mapStoreToProps, AntivirusSetting)
