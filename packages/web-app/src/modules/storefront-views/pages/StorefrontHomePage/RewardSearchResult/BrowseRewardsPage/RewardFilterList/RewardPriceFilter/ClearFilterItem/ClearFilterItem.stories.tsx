import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import { ClearFilterItem } from './ClearFilterItem'
import { createOption } from './RewardFilterPanel.stories'

export default {
  title: 'Modules/Rewards/Clear Filter Item',
  component: ClearFilterItem,
} as Meta

export const ClearItems = () => (
  <ClearFilterItem
    options={[
      createOption('Game', 22, true),
      createOption('Gift Card'),
      createOption('Donation'),
      createOption('Physical Good'),
    ]}
    onRemove={action('Remove')}
  />
)

export const NoneSelected = () => (
  <ClearFilterItem
    options={[createOption('Game'), createOption('Gift Card'), createOption('Donation'), createOption('Physical Good')]}
    onRemove={action('Remove')}
  />
)
