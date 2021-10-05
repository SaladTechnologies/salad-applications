import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import type { AntivirusSettingProps } from './AntivirusSetting'
import { AntivirusSetting } from './AntivirusSetting'

export default {
  title: 'Modules/Machine/Settings/Antivirus',
  component: AntivirusSetting,
  description: 'The Antivirus Setting Panel',
  args: {
    onWhitelistWindowsDefender: action('On Whitelist Windows Defender'),
    onViewAVGuide: action('On View AV Guide'),
  },
  argTypes: {
    detectedAV: {
      defaultValue: 'Windows Defender',
    },
  },
} as Meta

const Template: Story<AntivirusSettingProps> = (args) => {
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
      <AntivirusSetting {...args} />
    </div>
  )
}

export const Default: Story<AntivirusSettingProps> = Template.bind({})
Default.args = {}
