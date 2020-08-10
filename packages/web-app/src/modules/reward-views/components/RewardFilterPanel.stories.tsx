import React from 'react'
import { RewardFilterPanel } from './RewardFilterPanel'

export default {
  title: 'Modules/Rewards/Reward Filter Panel',
  component: RewardFilterPanel,
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

export const IgnoreEmptyFilters = () => <RewardFilterPanel />
