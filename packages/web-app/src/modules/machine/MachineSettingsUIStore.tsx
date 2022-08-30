import { WorkloadCardProps } from '@saladtechnologies/garden-components'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { delay } from '../../utils'
import { AntivirusSettingContainer, AutoStartSettingContainer, SleepModeSettingContainer } from '../machine-views'
import type { DesktopSettingPanels } from '../machine-views/settings/models/DesktopSettingsPanel'
import { NotificationMessageCategory } from '../notifications/models'
import { WhitelistWindowsDefenderErrorTypeMessage } from '../onboarding/models'
import { getAVData } from '../onboarding/utils'

export class MachineSettingsUIStore {
  @observable
  public whitelistWindowsDefenderPending: boolean = false

  @observable
  public whitelistWindowsDefenderErrorMessage?: WhitelistWindowsDefenderErrorTypeMessage

  @observable
  public disableSleepModePending: boolean = false

  @observable
  public disableSleepModeErrorMessage?: string = undefined

  @computed
  get workloads(): WorkloadCardProps[] {
    const saladBowlNotConnected = !this.store.saladBowl.saladBowlConnected
    const gpuEnabled = this.store.saladBowl.gpuMiningEnabled
    const gpuWorkload: WorkloadCardProps = {
      glow: gpuEnabled,
      onToggleWorkload: gpuEnabled ? () => this.store.saladBowl.setGpu(false) : () => this.store.saladBowl.setGpu(true),
      onToggleWorkloadLabel: `${gpuEnabled ? 'Disable' : 'Enable'} GPU`,
      onToggleWorkloadDisabled: saladBowlNotConnected,
      onToggleWorkloadLoading: this.store.saladBowl.gpuMiningUpdatePending,
      title: 'GPU',
      type: 'gpu',
    }

    const cpuEnabled = this.store.saladBowl.cpuMiningEnabled
    const cpuWorkload: WorkloadCardProps = {
      glow: cpuEnabled,
      onToggleWorkload: cpuEnabled ? () => this.store.saladBowl.setCpu(false) : () => this.store.saladBowl.setCpu(true),
      onToggleWorkloadLabel: `${cpuEnabled ? 'Disable' : 'Enable'} CPU`,
      onToggleWorkloadDisabled: saladBowlNotConnected,
      onToggleWorkloadLoading: this.store.saladBowl.cpuMiningUpdatePending,
      title: 'CPU',
      type: 'cpu',
    }

    return [cpuWorkload, gpuWorkload]
  }

  @computed
  get desktopSettings(): DesktopSettingPanels {
    return [
      {
        panel: <AntivirusSettingContainer />,
      },
      {
        panel: <SleepModeSettingContainer />,
      },
      {
        panel: <AutoStartSettingContainer />,
      },
    ]
  }

  constructor(private readonly store: RootStore) {}

  /**
   * Navigates to the requested antivirus guide based
   * on what antivirus software has been detected.
   */
  public onViewAVArticle = () => {
    const antiVirusSoftware = this.store.onboardingAntivirus.detectedAV
    if (antiVirusSoftware) {
      const articleId = getAVData(antiVirusSoftware).id
      this.store.ui.showModal(`/errors/anti-virus/${articleId}`)
    }
  }

  @action
  public setWhitelistWindowsErrorType = (errorType: WhitelistWindowsDefenderErrorTypeMessage) => {
    this.whitelistWindowsDefenderErrorMessage = errorType
  }

  @action.bound
  public whitelistWindowsDefender = flow(function* (this: MachineSettingsUIStore) {
    this.whitelistWindowsDefenderErrorMessage = undefined
    this.whitelistWindowsDefenderPending = true
    try {
      yield this.store.native.whitelistWindowsDefender()
      yield delay(2000)
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Success,
        title: 'You’ve successfully whitelisted Salad!',
        message:
          'Press the Start button to begin earning. The initial setup will then happen behind the scenes. This can take up to 30 minutes to complete.',
        autoClose: 5000,
      })
    } catch (_error: any) {
      const error: WhitelistWindowsDefenderErrorTypeMessage = _error
      this.setWhitelistWindowsErrorType(error)
    } finally {
      this.whitelistWindowsDefenderPending = false
    }
  })

  @action.bound
  public disableSleepMode = flow(function* (this: MachineSettingsUIStore) {
    this.disableSleepModeErrorMessage = undefined
    this.disableSleepModePending = true
    try {
      yield this.store.native.disableSleepMode()
    } catch {
      this.disableSleepModeErrorMessage =
        'Something went wrong and we were unable to adjust your sleep mode settings. You can adjust these settings yourself in Windows Settings, or contact support for assistance.'
    } finally {
      this.disableSleepModePending = false
    }
  })
}
