import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { RewardFilterPanel, ValueFilterOption } from './RewardFilterPanel'

export default {
  title: 'Modules/Rewards/Reward Filter Panel',
  component: RewardFilterPanel,
} as Meta

export const createOption = (value: string, count: number = 10, selected: boolean = false): ValueFilterOption => {
  return {
    value: value,
    count: count,
    selected: selected,
  }
}

export const SingleSelect = () => (
  <RewardFilterPanel
    label="Category"
    options={[createOption('Game'), createOption('Gift Card'), createOption('Donation'), createOption('Physical Good')]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
    onChange={action('Change')}
    onMoreClick={action('More')}
  />
)

export const MultiSelectNoneSelected = () => (
  <RewardFilterPanel
    label="Category"
    options={[createOption('Game'), createOption('Gift Card'), createOption('Donation'), createOption('Physical Good')]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
    onChange={action('Change')}
    onMoreClick={action('More')}
    multiSelect
  />
)
export const MultiSelectOneSelected = () => (
  <RewardFilterPanel
    label="Category"
    options={[
      createOption('Game', 22, true),
      createOption('Gift Card'),
      createOption('Donation'),
      createOption('Physical Good'),
    ]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
    onChange={action('Change')}
    onMoreClick={action('More')}
    multiSelect
  />
)

export const MoreOptions = () => (
  <RewardFilterPanel
    label="Category"
    options={[
      createOption('Game', 22, true),
      createOption('Gift Card'),
      createOption('Donation'),
      createOption('Physical Good'),
    ]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
    onChange={action('Change')}
    onMoreClick={action('More')}
    multiSelect
    showMore
  />
)
