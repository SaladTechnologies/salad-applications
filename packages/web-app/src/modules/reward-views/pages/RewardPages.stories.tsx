import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { RewardDetailsPage } from '.'
import { generateRewards } from '../components/RewardComponents.stories'

storiesOf('Modules/Reward Pages/Reward Details Page', module)
  .add('complete reward (in cart)', () => {
    let reward = generateRewards(1)[0]
    return (
      <RewardDetailsPage
        reward={reward}
        onRedeem={action('redeem')}
        isInCart={true}
        onAddToCart={action('add to cart')}
        onRemoveFromCart={action('remove from cart')}
      />
    )
  })
  .add('complete reward (not in cart)', () => {
    let reward = generateRewards(1)[0]
    return (
      <RewardDetailsPage
        reward={reward}
        onRedeem={action('redeem')}
        isInCart={false}
        onAddToCart={action('add to cart')}
        onRemoveFromCart={action('remove from cart')}
      />
    )
  })
