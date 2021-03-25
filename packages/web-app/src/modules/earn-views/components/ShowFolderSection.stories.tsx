import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { ShowFolderSection } from './index'

export default {
  title: 'Modules/Earn/components/Show Folder Section',
  component: ShowFolderSection,
} as Meta

export const ShowApplicationLogFolderSection = () => <ShowFolderSection openFolder={action('open folder')} />
