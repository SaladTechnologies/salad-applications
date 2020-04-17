import React from 'react'
import { RewardFilterPanel } from './RewardFilterPanel'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Modules/Rewards/Reward Filter Panel',
  component: RewardFilterPanel,
}

export const Basic = () => (
  <RewardFilterPanel
    priceFilter={{ label: 'Free', value: 5, onChance: action('price') }}
    stockFilter={{ label: 'In Stock', active: true, onToggle: action('stock') }}
    redeemableFilter={{ label: 'Redeemable', active: false, onToggle: action('redeemable') }}
    tagFilters={[
      { label: 'Tag 1', active: false, onToggle: action('tag1') },
      { label: 'Tag 2', active: false, onToggle: action('tag2') },
      { label: 'This is a really really long tag', active: false, onToggle: action('long tag') },
    ]}
  />
)
