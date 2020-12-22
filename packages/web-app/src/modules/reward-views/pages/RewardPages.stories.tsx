import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { BrowseRewardsPage, MainStorefrontPage, RewardDetailsPage } from '.'
import { generateResults, generateRewards } from '../components/RewardComponents.stories'

storiesOf('Modules/Reward Pages/Main Storefront Page', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('with rewards (no hero)', () => {
    let rewards = generateRewards(8)
    let categories = new Map()
    categories.set('category 1', rewards)
    categories.set('category 2', rewards)
    return <MainStorefrontPage categories={categories} />
  })
  .add('with rewards (w/ hero)', () => {
    let rewards = generateRewards(8)
    let categories = new Map()
    categories.set('top chops', rewards)
    categories.set('category 1', rewards)
    categories.set('category 2', rewards)
    return <MainStorefrontPage categories={categories} />
  })
  .add('without rewards (undefined)', () => {
    return <MainStorefrontPage categories={undefined} />
  })
  .add('without rewards (empty)', () => {
    return <MainStorefrontPage categories={new Map()} />
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
  .add('with rewards (n=1)', () => {
    let results = generateResults(1)
    return <BrowseRewardsPage results={results} onBack={action('back')} />
  })
  .add('with rewards (n=4)', () => {
    let results = generateResults(4)
    return <BrowseRewardsPage results={results} onBack={action('back')} />
  })
  .add('with rewards (n=10)', () => {
    let results = generateResults(10)
    return <BrowseRewardsPage results={results} onBack={action('back')} />
  })
  .add('with rewards & title (n=50)', () => {
    let results = generateResults(50)
    return <BrowseRewardsPage title={'Amazing Games'} results={results} onBack={action('back')} />
  })
  .add('no rewards w/ title', () => {
    return <BrowseRewardsPage title={'Amazing Games'} results={undefined} onBack={action('back')} />
  })
  .add('no rewards (undefined)', () => {
    return <BrowseRewardsPage results={undefined} onBack={action('back')} />
  })
  .add('no rewards (empty)', () => {
    return <BrowseRewardsPage results={[]} onBack={action('back')} />
  })
  .add('with title', () => {
    return <BrowseRewardsPage title={'Amazing Games'} results={[]} onBack={action('back')} />
  })
  .add('no title', () => {
    return <BrowseRewardsPage title={undefined} results={[]} onBack={action('back')} />
  })
