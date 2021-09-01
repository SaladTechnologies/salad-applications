import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { MachineInfo, MachineSettingsPage, MachineSettingsPageProps } from './MachineSettingsPage'

const gpuInfo: MachineInfo = {
  processor: {
    name: 'NVIDIA GeForce RTX 2080',
    temperature: '62° C',
    percentageUtilized: 100,
  },
  miner: {
    name: 'PhoenixMiner',
    version: '5.6d',
    algorithm: 'Ethash',
  },
}

const cpuInfo: MachineInfo = {
  processor: {
    name: 'AMD Ryzen 7 5500XT',
    temperature: '62° C',
    percentageUtilized: 0,
  },
  miner: {
    name: undefined,
    version: undefined,
    algorithm: undefined,
  },
}

export default {
  title: 'Modules/Machine/Machine Settings Page',
  component: MachineSettingsPage,
  description: 'The Machine Settings Page',
  args: {
    onShowLogFolder: action('Show Log Folder'),
  },
  argTypes: {
    cpuInfo: { defaultValue: cpuInfo, description: "The chef's CPU information." },
    gpuInfo: { defaultValue: gpuInfo, description: "The chef's GPU information." },
    gpuMiningEnabled: {
      defaultValue: true,
      description: 'The state of whether or not the chef has set gpu mining as enabled',
    },
  },
} as Meta

const Template: Story<MachineSettingsPageProps> = (args) => {
  const [gpuEnabled, toggleGpuEnabled] = useState(true)
  const [cpuEnabled, toggleCpuEnabled] = useState(false)
  const [autoStartEnabled, toggleAutoStart] = useState(false)
  const [autoLaunchEnabled, toggleAutoLaunch] = useState(false)
  const [closeToTrayEnabled, toggleCloseToTray] = useState(false)

  const onEnableGpuOnly = () => {
    toggleGpuEnabled(true)
    toggleCpuEnabled(false)
  }

  const onEnableCpuOnly = () => {
    toggleCpuEnabled(true)
    toggleGpuEnabled(false)
  }

  const onEnableCpuAndGpu = () => {
    toggleCpuEnabled(true)
    toggleGpuEnabled(true)
  }

  args.gpuMiningEnabled = gpuEnabled
  args.onSetGPUMiningOnly = onEnableGpuOnly
  args.cpuMiningEnabled = cpuEnabled
  args.onSetCPUMiningOnly = onEnableCpuOnly
  args.onSetGPUAndCPUMining = onEnableCpuAndGpu

  args.autoStartEnabled = autoStartEnabled
  args.onToggleAutoStart = (value: boolean) => toggleAutoStart(value)

  args.autoLaunchEnabled = autoLaunchEnabled
  args.onToggleAutoLaunch = (value: boolean) => toggleAutoLaunch(value)

  args.closeToTrayEnabled = closeToTrayEnabled
  args.onToggleCloseToTray = (value: boolean) => toggleCloseToTray(value)

  return (
    <div>
      <MachineSettingsPage {...args} />
    </div>
  )
}

export const Default: Story<MachineSettingsPageProps> = Template.bind({})
Default.args = {}
