import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { RewardDetailsPage, BrowseRewardsPage, MainStorefrontPage } from '.'
import { generateRewards } from '../components/RewardComponents.stories'

storiesOf('Modules/Reward Pages/Main Storefront Page', module)
  .addDecorator(storyFn => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('with rewards', () => {
    let rewards = generateRewards(1)[8]
    let categories = new Map()
    categories.set('Category 1', rewards)
    categories.set('Category 2', rewards)
    return <MainStorefrontPage onViewReward={action('view reward')} categories={categories} />
  })

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

storiesOf('Modules/Reward Pages/Browse Rewards Page', module)
  .addDecorator(storyFn => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('with rewards (n=1)', () => {
    let rewards = generateRewards(1)
    return <BrowseRewardsPage rewards={rewards} onViewReward={action('view reward')} />
  })
  .add('with rewards (n=4)', () => {
    let rewards = generateRewards(4)
    return <BrowseRewardsPage rewards={rewards} onViewReward={action('view reward')} />
  })
  .add('with rewards (n=10)', () => {
    let rewards = generateRewards(10)
    return <BrowseRewardsPage rewards={rewards} onViewReward={action('view reward')} />
  })
  .add('with rewards & title (n=50)', () => {
    let rewards = generateRewards(50)
    return <BrowseRewardsPage title={'Amazing Games'} rewards={rewards} onViewReward={action('view reward')} />
  })
  .add('no rewards w/ title', () => {
    return <BrowseRewardsPage title={'Amazing Games'} rewards={undefined} onViewReward={action('view reward')} />
  })
  .add('no rewards (undefined)', () => {
    return <BrowseRewardsPage rewards={undefined} onViewReward={action('view reward')} />
  })
  .add('no rewards (empty)', () => {
    return <BrowseRewardsPage rewards={[]} onViewReward={action('view reward')} />
  })
  .add('with title', () => {
    return <BrowseRewardsPage title={'Amazing Games'} rewards={[]} onViewReward={action('view reward')} />
  })
