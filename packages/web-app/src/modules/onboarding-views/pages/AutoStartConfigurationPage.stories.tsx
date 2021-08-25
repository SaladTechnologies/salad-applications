import { action } from '@storybook/addon-actions'
import type { Meta, Story } from '@storybook/react'
import type { AutoStartConfigurationPageProps } from './AutoStartConfigurationPage'
import { AutoStartConfigurationPage } from './AutoStartConfigurationPage'

export default {
  title: 'Modules/Onboarding/AutoStartConfigurationPage',
  component: AutoStartConfigurationPage,
  description: 'The Auto-Start Onboarding Page',
  args: {
    onSkipAutoStart: action('Skip Auto-Start Configuration'),
    onEnableAutoStart: action('Enabled Auto-Start'),
  },
} as Meta

const Template: Story<AutoStartConfigurationPageProps> = (args) => <AutoStartConfigurationPage {...args} />

export const Default: Story<AutoStartConfigurationPageProps> = Template.bind({})
Default.args = {}
