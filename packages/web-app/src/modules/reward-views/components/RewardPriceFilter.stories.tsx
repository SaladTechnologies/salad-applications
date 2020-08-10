import { action } from '@storybook/addon-actions'
import React from 'react'
import { PriceFilterOption, RewardPriceFilter } from './RewardPriceFilter'

export default {
  title: 'Modules/Rewards/Reward Price Filter',
  component: RewardPriceFilter,
}

// const categoryFilter = {
//   type: FilterType.Value,
//   field: 'categories',
//   data: [
//     { value: 'games', count: 123 },
//     { value: 'gift card', count: 3 },
//   ],
// }

// const emptyCategory = { type: FilterType.Value, field: 'empty things', data: [] }

const createOption = (
  name: string,
  from?: number,
  to?: number,
  count: number = 10,
  selected: boolean = false,
): PriceFilterOption => {
  return {
    value: { from: from, to: to, name: name },
    count: count,
    selected: selected,
  }
}

export const NoneSelected = () => (
  <RewardPriceFilter
    label="Price"
    options={[
      createOption('0 to 1', 0, 1, 5),
      createOption('1 to 2', 1, 2, 10),
      createOption('2 to 3', 2, 3, 15),
      createOption('3 to 4', 3, 4, 20),
    ]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
  />
)

export const ItemSelected = () => (
  <RewardPriceFilter
    label="Price"
    options={[
      createOption('0 to 1', 0, 1, 5, true),
      createOption('1 to 2', 1, 2, 10),
      createOption('2 to 3', 2, 3, 15),
      createOption('3 to 4', 3, 4, 20),
    ]}
    onSelect={action('Select')}
    onRemove={action('Remove')}
  />
)
