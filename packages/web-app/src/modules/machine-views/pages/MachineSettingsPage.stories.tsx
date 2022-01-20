import { WorkloadCardProps } from '@saladtechnologies/garden-components'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { AntivirusSetting, AutoStartSetting, SleepModeSetting } from '../settings'
import type { DesktopSettingPanels } from '../settings/models/DesktopSettingsPanel'
import type { MachineSettingsPageProps } from './MachineSettingsPage'
import { MachineSettingsPage } from './MachineSettingsPage'

export default {
  title: 'Modules/Machine/Machine Settings Page',
  component: MachineSettingsPage,
  description: 'The Machine Settings Page',
  argTypes: {
    workloads: {
      description: 'The Workloads available for the chef to enable or disable',
    },
  },
} as Meta

const Template: Story<MachineSettingsPageProps> = (args) => {
  const [gpuEnabled, toggleGpuEnabled] = useState<boolean>(true)
  const [gpuOverrideEnabled, toggleGpuOverride] = useState<boolean>(false)
  const [cpuEnabled, toggleCpuEnabled] = useState<boolean>(false)
  const [cpuOverrideEnabled, toggleCpuOverride] = useState<boolean>(false)

  const workloads: WorkloadCardProps[] = [
    {
      glow: gpuEnabled ? true : false,
      onToggleWorkload: gpuEnabled ? () => toggleGpuEnabled(false) : () => toggleGpuEnabled(true),
      onToggleWorkloadLabel: `${gpuEnabled ? 'Disable' : 'Enable'} GPU Mining`,
      onToggleOverrideLabel: 'Override GPU Compatibility Detection',
      onToggleOverride: gpuOverrideEnabled ? () => toggleGpuOverride(false) : () => toggleGpuOverride(true),
      overrideChecked: gpuOverrideEnabled,
      onToggleOverrideTooltip:
        'If Salad Is Unable To Detect A Compatible GPU, You Can Choose To Override GPU Detection. This Takes Longer To Start And Can Be Less Profitable',
      title: 'GPU Mining',
      type: 'gpu',
    },
    {
      glow: cpuEnabled ? true : false,
      onToggleWorkload: cpuEnabled ? () => toggleCpuEnabled(false) : () => toggleCpuEnabled(true),
      onToggleWorkloadLabel: `${cpuEnabled ? 'Disable' : 'Enable'} CPU Mining`,
      onToggleOverrideLabel: 'Override CPU Compatibility Detection',
      onToggleOverride: cpuOverrideEnabled ? () => toggleCpuOverride(false) : () => toggleCpuOverride(true),
      onToggleOverrideTooltip:
        'If Salad Is Unable To Detect A Compatible CPU, You Can Choose To Override CPU Detection. This Takes Longer To Start And Can Be Less Profitable',
      overrideChecked: cpuOverrideEnabled,
      title: 'CPU Mining',
      type: 'cpu',
    },
  ]

  const [autoStartEnabled, toggleAutoStart] = useState<boolean>(false)
  const [autoStartTime, setAutoStartTime] = useState<number>(600)

  const desktopSettings: DesktopSettingPanels = [
    {
      panel: (
        <AntivirusSetting
          detectedAV="Windows Defender"
          onViewAVGuide={action('On View AV Guide')}
          onViewAVList={action('On View AV List')}
          onWhitelistWindowsDefender={action('On Whitelist Windows Defender')}
        />
      ),
    },
    {
      panel: <SleepModeSetting onDisableSleepMode={action('On Disable Sleep Mode')} />,
    },
    {
      panel: (
        <AutoStartSetting
          autoStartEnabled={autoStartEnabled}
          autoStartTime={autoStartTime}
          onToggleAutoStart={() => toggleAutoStart(!autoStartEnabled)}
          onSetMinutesIdle={(minutes: number) => setAutoStartTime(minutes)}
        />
      ),
    },
  ]

  args.workloads = workloads
  args.desktopSettings = desktopSettings
  return (
    <div>
      <MachineSettingsPage {...args} />
    </div>
  )
}

export const Default: Story<MachineSettingsPageProps> = Template.bind({})
Default.args = {}
