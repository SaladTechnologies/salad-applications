import { WorkloadCardProps } from '@saladtechnologies/garden-components'
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { delay } from '../../utils'
import {
  AntivirusSettingContainer,
  AutoLaunchSettingContainer,
  AutoStartSettingContainer,
  CloseToTraySettingContainer,
  LogsSettingContainer,
  SleepModeSettingContainer,
} from '../machine-views'
import type { DesktopSettingPanels } from '../machine-views/settings/models/DesktopSettingsPanel'
import { NotificationMessageCategory } from '../notifications/models'
import { WhitelistWindowsDefenderErrorTypeMessage } from '../onboarding/models'
import { getZendeskAVData } from '../zendesk/utils'

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
    const gpuMiningOverridden = this.store.saladBowl.gpuMiningOverridden
    const gpuWorkload: WorkloadCardProps = {
      glow: gpuEnabled,
      onToggleWorkload: gpuEnabled ? () => this.store.saladBowl.setGpu(false) : () => this.store.saladBowl.setGpu(true),
      onToggleWorkloadLabel: `${gpuEnabled ? 'Disable' : 'Enable'} GPU Mining`,
      onToggleWorkloadDisabled: saladBowlNotConnected,
      onToggleWorkloadLoading: this.store.saladBowl.gpuMiningUpdatePending,
      overrideChecked: gpuMiningOverridden,
      onToggleOverride: gpuMiningOverridden
        ? () => this.store.saladBowl.setGpuOverride(false)
        : () => this.store.saladBowl.setGpuOverride(true),
      onToggleOverrideDisabled: saladBowlNotConnected,
      onToggleOverrideLoading: this.store.saladBowl.gpuMiningOverriddenUpdatePending,
      onToggleOverrideLabel: 'Override GPU Compatibility Detection',
      onToggleOverrideTooltip:
        'If Salad Is Unable To Detect A Compatible GPU, You Can Choose To Override GPU Detection. This Takes Longer To Start And Can Be Less Profitable',
      title: 'GPU Mining',
      type: 'gpu',
    }

    const cpuEnabled = this.store.saladBowl.cpuMiningEnabled
    const cpuMiningOverridden = this.store.saladBowl.cpuMiningOverridden
    const cpuWorkload: WorkloadCardProps = {
      glow: cpuEnabled,
      onToggleWorkload: cpuEnabled ? () => this.store.saladBowl.setCpu(false) : () => this.store.saladBowl.setCpu(true),
      onToggleWorkloadLabel: `${cpuEnabled ? 'Disable' : 'Enable'} CPU Mining`,
      onToggleWorkloadDisabled: saladBowlNotConnected,
      onToggleWorkloadLoading: this.store.saladBowl.cpuMiningUpdatePending,
      overrideChecked: cpuMiningOverridden,
      onToggleOverride: cpuMiningOverridden
        ? () => this.store.saladBowl.setCpuOverride(false)
        : () => this.store.saladBowl.setCpuOverride(true),
      onToggleOverrideDisabled: saladBowlNotConnected,
      onToggleOverrideLoading: this.store.saladBowl.cpuMiningOverriddenUpdatePending,
      onToggleOverrideLabel: 'Override CPU Compatibility Detection',
      onToggleOverrideTooltip:
        'If Salad Is Unable To Detect A Compatible CPU, You Can Choose To Override CPU Detection. This Takes Longer To Start And Can Be Less Profitable',
      title: 'CPU Mining',
      type: 'cpu',
    }

    return [cpuWorkload, gpuWorkload]
  }

  @computed
  get desktopSettings(): DesktopSettingPanels {
    return [
      {
        panel: <AntivirusSettingContainer />,
        isAdvanced: false,
      },
      {
        panel: <SleepModeSettingContainer />,
        isAdvanced: false,
      },
      {
        panel: <AutoStartSettingContainer />,
        isAdvanced: false,
      },
      {
        panel: <CloseToTraySettingContainer />,
        isAdvanced: true,
      },
      {
        panel: <AutoLaunchSettingContainer />,
        isAdvanced: true,
      },
      {
        panel: <LogsSettingContainer />,
        isAdvanced: true,
      },
    ]
  }

  constructor(private readonly store: RootStore) {}

  /**
   * Navigates to the requested zendesk antivirus guide based
   * on what antivirus software has been detected.
   */
  public onViewAVArticle = () => {
    const antiVirusSoftware = this.store.zendesk.detectedAV
    if (antiVirusSoftware) {
      const articleId = getZendeskAVData(antiVirusSoftware).id
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
