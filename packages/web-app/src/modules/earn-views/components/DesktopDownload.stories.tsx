import React from 'react'
import { DesktopDownload } from '.'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Modules/Earn/components/Desktop Download',
  component: DesktopDownload,
}

export const InDesktop = () => <DesktopDownload onDownload={action('download')} isNative={true} />
export const InWeb = () => <DesktopDownload onDownload={action('download')} isNative={false} />
