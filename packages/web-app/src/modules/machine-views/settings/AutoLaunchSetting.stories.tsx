import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import type { AutoLaunchSettingProps } from './AutoLaunchSetting'
import { AutoLaunchSetting } from './AutoLaunchSetting'

export default {
  title: 'Modules/Machine/Settings/AutoLaunch',
  component: AutoLaunchSetting,
  description: 'The Auto Launch Setting Panel',
  argTypes: {
    autoLaunchEnabled: {
      defaultValue: false,
      description: 'The flag that determines whether or not a chefs has enabled auto launch.',
    },
    onToggleAutoLaunch: {
      defaultValue: action('On Toggle Auto Launch'),
      description: 'The callback that toggles whether or not a chef wants to have auto launch enabled.',
    },
  },
} as Meta

const Template: Story<AutoLaunchSettingProps> = (args) => {
  const [autoLaunchEnabled, toggleAutoLaunch] = useState<boolean>(args.autoLaunchEnabled)

  args.onToggleAutoLaunch = () => toggleAutoLaunch(!autoLaunchEnabled)
  args.autoLaunchEnabled = autoLaunchEnabled

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
      <AutoLaunchSetting {...args} />
    </div>
  )
}

export const Default: Story<AutoLaunchSettingProps> = Template.bind({})
Default.args = {}
