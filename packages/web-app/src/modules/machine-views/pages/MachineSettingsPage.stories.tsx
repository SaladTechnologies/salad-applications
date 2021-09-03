import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import type { MinerWorkload, ProcessorInformation } from '../../machine/models'
import type { MachineSettingsPageProps } from './MachineSettingsPage'
import { MachineSettingsPage } from './MachineSettingsPage'

const gpus: ProcessorInformation[] = [
  {
    name: 'NVIDIA GeForce RTX 2080',
    temperature: '62° C',
    percentageUtilized: 100,
  },
]

const cpu: ProcessorInformation = {
  name: 'AMD Ryzen 7 5500XT',
  temperature: '62° C',
  percentageUtilized: 0,
}

const miner: MinerWorkload = {
  name: 'Phoenix1',
  version: '56',
  algorithm: 'Ethash',
}

export default {
  title: 'Modules/Machine/Machine Settings Page',
  component: MachineSettingsPage,
  description: 'The Machine Settings Page',
  args: {
    onShowLogFolder: action('Show Log Folder'),
  },
  argTypes: {
    miner: { defaultValue: miner, description: "The chef's current miner running. " },
    cpu: { defaultValue: cpu, description: "The chef's CPU information." },
    gpus: { defaultValue: gpus, description: "The chef's GPU information." },
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
