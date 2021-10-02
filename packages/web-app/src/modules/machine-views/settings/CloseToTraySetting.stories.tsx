import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import type { CloseToTraySettingProps } from './CloseToTraySetting'
import { CloseToTraySetting } from './CloseToTraySetting'

export default {
  title: 'Modules/Machine/Settings/CloseToTray',
  component: CloseToTraySetting,
  description: 'The Close To Tray Setting Panel',
  argTypes: {
    notify: {
      defaultValue: false,
      description: 'The flag that determines whether or not a chefs wants to be notified when they close to tray.',
    },
    closeToTray: {
      defaultValue: false,
      description: 'The flag that determines whether or not a chefs has enabled close to tray.',
    },
    onToggleCloseToTray: {
      defaultValue: action('On Toggle Close To Tray'),
      description: 'The callback that toggles whether or not a chef wants to have close to tray enabled.',
    },
    onToggleNotification: {
      defaultValue: action('On Toggle Notification'),
      description: 'The callback that toggles whether or not a chef wants to be notified when the tray is closed.',
    },
  },
} as Meta

const Template: Story<CloseToTraySettingProps> = (args) => {
  const [notify, toggleNotify] = useState<boolean>(args.notify)
  const [closeToTray, toggleCloseToTray] = useState<boolean>(args.closeToTray)

  args.onToggleNotification = () => toggleNotify(!notify)
  args.notify = notify
  args.onToggleCloseToTray = () => toggleCloseToTray(!closeToTray)
  args.closeToTray = closeToTray

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
      <CloseToTraySetting {...args} />
    </div>
  )
}

export const Default: Story<CloseToTraySettingProps> = Template.bind({})
Default.args = {}
