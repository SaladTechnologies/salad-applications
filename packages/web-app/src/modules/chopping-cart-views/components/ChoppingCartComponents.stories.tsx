import React from 'react'
import { storiesOf } from '@storybook/react'
import { ChoppingCartButton, ChoppingCartTooltip, AddToCartButton } from '.'
import { generateRewards } from '../../reward-views/components/RewardComponents.stories'
import { action } from '@storybook/addon-actions'

storiesOf('Modules/Chopping Cart/Button', module)
  .add('with rewards (n=1)', () => {
    let rewards = generateRewards(1)
    return <ChoppingCartButton rewards={rewards} />
  })
  .add('with rewards (n=10)', () => {
    let rewards = generateRewards(10)
    return <ChoppingCartButton rewards={rewards} />
  })
  .add('no rewards (undefined)', () => {
    return <ChoppingCartButton rewards={undefined} />
  })
  .add('no rewards (empty)', () => {
    return <ChoppingCartButton rewards={[]} />
  })

storiesOf('Modules/Chopping Cart/Tooltip', module)
  .add('with rewards (n=1)', () => {
    let rewards = generateRewards(1)
    return <ChoppingCartTooltip rewards={rewards} />
  })
  .add('with missing cover image (n=1)', () => {
    let rewards = generateRewards(1)
    rewards[0].coverImage = undefined
    return <ChoppingCartTooltip rewards={rewards} />
  })
  .add('with rewards (n=10)', () => {
    let rewards = generateRewards(10)
    rewards[3].coverImage = undefined
    return <ChoppingCartTooltip rewards={rewards} />
  })
  .add('no rewards (undefined)', () => {
    return <ChoppingCartTooltip rewards={undefined} />
  })
  .add('no rewards (empty)', () => {
    return <ChoppingCartTooltip rewards={[]} />
  })

storiesOf('Modules/Chopping Cart/Add To Cart', module)
  .add('not in cart', () => {
    let reward = generateRewards(1)[0]
    return (
      <AddToCartButton
        isInCart={false}
        reward={reward}
        onAddToCart={action('add')}
        onRemoveFromCart={action('remove')}
      />
    )
  })
  .add('already in cart', () => {
    let reward = generateRewards(1)[0]
    return (
      <AddToCartButton
        isInCart={true}
        reward={reward}
        onAddToCart={action('add')}
        onRemoveFromCart={action('remove')}
      />
    )
  })
