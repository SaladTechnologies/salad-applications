import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import type { SleepModeSettingProps } from './SleepModeSetting'
import { SleepModeSetting } from './SleepModeSetting'

export default {
  title: 'Modules/Machine/Settings/SleepMode',
  component: SleepModeSetting,
  description: 'The Sleep Mode Setting Panel',
  args: {
    onDisableSleepMode: action('On Disable Sleep Mode'),
  },
  argTypes: {
    onDisableSleepMode: {
      description: 'A callback that disables sleep mode',
    },
  },
} as Meta

const Template: Story<SleepModeSettingProps> = (args) => {
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
      <SleepModeSetting {...args} />
    </div>
  )
}

export const Default: Story<SleepModeSettingProps> = Template.bind({})
Default.args = {}
