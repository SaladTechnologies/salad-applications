import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { DesktopDownload } from '.'

export default {
  title: 'Modules/Earn/components/Desktop Download',
  component: DesktopDownload,
} as Meta

export const InDesktop = () => <DesktopDownload onDownload={action('download')} isNative={true} />
export const InWeb = () => <DesktopDownload onDownload={action('download')} isNative={false} />
