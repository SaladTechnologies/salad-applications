import { Meta } from '@storybook/react'
import { TabControl, TabItem } from './TabControl'

export default {
  title: 'Components/Tab Control',
  component: TabControl,
} as Meta

export const NoItems = () => <TabControl />
export const OneItem = () => <TabControl tabs={[new TabItem('Item 1', '/item-1')]} />
export const MultipleItems = () => (
  <TabControl
    tabs={[
      new TabItem('Item 1', '/item-1'),
      new TabItem('Item 2', '/item-2'),
      new TabItem('Item 3', '/item-3'),
      new TabItem('Item 4', '/item-4'),
    ]}
  />
)
