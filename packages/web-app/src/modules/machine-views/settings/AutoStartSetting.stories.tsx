import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import type { AutoStartSettingProps } from './AutoStartSetting'
import { AutoStartSetting } from './AutoStartSetting'

export default {
  title: 'Modules/Machine/Settings/AutoStart',
  component: AutoStartSetting,
  description: 'The Auto Start Setting Panel',
  argTypes: {
    onToggleAutoStart: {
      description: 'A callback that enables auto start at the time selected with the slider',
    },
  },
} as Meta

const Template: Story<AutoStartSettingProps> = (args) => {
  const [autoStartEnabled, toggleAutoStart] = useState<boolean>(false)
  const [autoStartTime, setAutoStartTime] = useState<number>(10)

  args.autoStartEnabled = autoStartEnabled
  args.onToggleAutoStart = () => toggleAutoStart(!autoStartEnabled)
  args.autoStartTime = autoStartTime
  args.onSetMinutesIdle = (minutes: number) => setAutoStartTime(minutes)
  return (
    <div
      style={{
        flex: 1,
        backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
        display: 'flex',
        height: '100vh',
        padding: 24,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <AutoStartSetting {...args} />
    </div>
  )
}

export const Default: Story<AutoStartSettingProps> = Template.bind({})
Default.args = {}
