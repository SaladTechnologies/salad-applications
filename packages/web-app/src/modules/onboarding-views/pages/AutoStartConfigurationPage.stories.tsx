import { action } from '@storybook/addon-actions'
import type { Meta, Story } from '@storybook/react'
import { AutoStartConfigurationPage, AutoStartConfigurationPageProps } from './AutoStartConfigurationPage'

export default {
  title: 'Modules/Onboarding/AutoStartConfigurationPage',
  component: AutoStartConfigurationPage,
  description: 'The Antivirus Configuration Onboaridng Page',
  args: {
    onSkipAutoStartConfiguration: action('Skip Auto-Start Configuration'),
    onEnableAutoStart: action('Enabled Auto-Start'),
  },
  decorators: [(Story) => <Story />],
} as Meta

const Template: Story<AutoStartConfigurationPageProps> = (args) => <AutoStartConfigurationPage {...args} />

export const Default: Story<AutoStartConfigurationPageProps> = Template.bind({})
Default.args = {}
