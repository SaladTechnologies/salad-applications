import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import type { LogsSettingProps } from './LogsSetting'
import { LogsSetting } from './LogsSetting'

export default {
  title: 'Modules/Machine/Settings/Logs',
  component: LogsSetting,
  description: 'The Logs Setting Panel',
  args: {
    onShowLogFolder: action('On Show Log Folder'),
  },
  argTypes: {
    onDisableLogs: {
      description: 'A callback that shows the log folder to the chef.',
    },
  },
} as Meta

const Template: Story<LogsSettingProps> = (args) => {
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
      <LogsSetting {...args} />
    </div>
  )
}

export const Default: Story<LogsSettingProps> = Template.bind({})
Default.args = {}
