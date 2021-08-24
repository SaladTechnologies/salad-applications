import { action } from '@storybook/addon-actions'
import type { Meta, Story } from '@storybook/react'
import { SleepModeConfigurationPage, SleepModeConfigurationPageProps } from './SleepModeConfigurationPage'

export default {
  title: 'Modules/Onboarding/SleepModeConfigurationPage',
  component: SleepModeConfigurationPage,
  description: 'The Antivirus Configuration Onboaridng Page',
  args: {
    onSkipSleepModeConfiguration: action('Skip Auto-Start Configuration'),
    onEnableAutoStart: action('Enabled Auto-Start'),
  },
  decorators: [(Story) => <Story />],
} as Meta

const Template: Story<SleepModeConfigurationPageProps> = (args) => <SleepModeConfigurationPage {...args} />

export const Default: Story<SleepModeConfigurationPageProps> = Template.bind({})
Default.args = {}

export const ErrorMessage: Story<SleepModeConfigurationPageProps> = Template.bind({})
ErrorMessage.args = {
  sleepModeErrorMessage:
    'Something went wrong and we were unable to adjust your sleep mode settings. You can adjust these settings yourself in Windows Settings, or contact support for assistance.',
}
