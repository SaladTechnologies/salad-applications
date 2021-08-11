import { action } from '@storybook/addon-actions'
import type { Meta, Story } from '@storybook/react'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { AntiVirusSoftware } from '../../zendesk/models'
import { AntivirusConfigurationPage, AntivirusConfigurationPageProps } from './AntivirusConfigurationPage'

export default {
  title: 'Modules/Onboarding/AntivirusConfigurationPage',
  component: AntivirusConfigurationPage,
  description: 'The Antivirus Configuration Onboaridng Page',
  args: {
    onWhitelistWindowsDefender: action('Whitelist Windows Defender'),
    onViewAVGuideSelectionModal: action('On View Antivirus Guide Selection Modal'),
    onViewAVGuide: action('View AV Guide Click'),
  },
  argTypes: {
    detectedAV: { defaultValue: AntiVirusSoftware.McAfeeSecurity },
    onViewAVGuideLabel: { defaultValue: 'Open McAfee Guide' },
  },
  decorators: [
    (Story) => (
      <AssetLoader>
        <Story />
      </AssetLoader>
    ),
  ],
} as Meta

const Template: Story<AntivirusConfigurationPageProps> = (args) => <AntivirusConfigurationPage {...args} />

export const Default: Story<AntivirusConfigurationPageProps> = Template.bind({})
Default.args = {}

export const DetectedWindowsDefender: Story<AntivirusConfigurationPageProps> = Template.bind({})
DetectedWindowsDefender.args = {
  detectedAV: AntiVirusSoftware.WindowsDefender,
  onViewAVGuideLabel: `Open ${AntiVirusSoftware.WindowsDefender} Guide`,
}

export const NoAVDetected: Story<AntivirusConfigurationPageProps> = Template.bind({})
NoAVDetected.args = {
  detectedAV: undefined,
  onViewAVGuideLabel: 'Select My Antivirus Program',
  onViewAVGuide: action('On View Antivirus Guide Selection Modal'),
}

const loadTrustPilotScript = () => {
  const scriptElement = document.createElement('script')
  scriptElement.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js'
  scriptElement.type = 'text/javascript'

  if (document) {
    const headElement = document.querySelector('head')
    if (headElement) {
      headElement.appendChild(scriptElement)
    }
  }
}

interface AssetLoaderProps {
  children: ReactElement
}

const AssetLoader = ({ children }: AssetLoaderProps) => {
  useEffect(() => loadTrustPilotScript(), [])
  return <>{children}</>
}
