import React from 'react'
import { storiesOf } from '@storybook/react'
import { RewardSummary } from './RewardSummary'
import demoImage from '../../../../.storybook/assets/itunes-app-store-card.png'
import { action } from '@storybook/addon-actions'
import { RewardList } from './RewardList'
import { Reward } from '../../reward/models/Reward'
import { RewardFilterPage } from './RewardFilterPage'
import { SearchBar } from './SearchBar'
import { FilterList } from './FilterList'
import { FilterItem } from '../../reward/models/FilterItem'
import { SelectedReward } from './SelectedReward'
import { RewardDetailsModal } from './RewardDetailsModal'

const generateRewards = (count: number): Reward[] => {
  let result = new Array<Reward>(count)

  for (var i = count - 1; i >= 0; i--) {
    result[i] = {
      id: String(i),
      name: `$${i}.00 Salad Gift Card`,
      details: 'Here are some details! And some more details! Lots and lots of details!!!',
      price: i,
      redeemable: i < count / 2,
      imageSrc: demoImage,
      filter: 'Game',
      remainingTimeLabel: '2 days',
      percentUnlocked: 0.5,
      color: 'red',
    }
  }

  return result
}

const getFilters = [new FilterItem('Games', true), new FilterItem('Loot', false), new FilterItem('Money', true)]

storiesOf('Modules|Reward/Reward Details Modal', module)
  .add('redeemable ', () => {
    let reward = generateRewards(2)[0]
    return (
      <div>
        <RewardDetailsModal
          reward={reward}
          onSelect={action('select')}
          onClickClose={action('close')}
          onRedeem={action('redeem')}
        />
      </div>
    )
  })
  .add('not redeemable ', () => {
    let reward = generateRewards(2)[1]
    return (
      <div>
        <RewardDetailsModal
          reward={reward}
          onSelect={action('select')}
          onClickClose={action('close')}
          onRedeem={action('redeem')}
        />
      </div>
    )
  })

storiesOf('Modules|Reward/Reward Summary', module)
  .add('with images', () => {
    const frameStyle = { paddingBottom: '.5rem' }
    return (
      <div>
        <div style={frameStyle}>
          <RewardSummary
            name="$20 Steam Gift Card"
            price={20}
            redeemable={true}
            imageSrc={demoImage}
            color="red"
            onClick={action('Clicked')}
          />
        </div>
        <div style={frameStyle}>
          <RewardSummary
            name="Razer Blackwidow Ultimate Keyboard 2018"
            price={999.99}
            redeemable={false}
            timeRemaining={'3 weeks'}
            imageSrc={demoImage}
            color="red"
            onClick={action('Clicked')}
          />
        </div>
        <div style={frameStyle}>
          <RewardSummary
            name="Razer Blackwidow Ultimate Keyboard 2018"
            price={999.99}
            redeemable={false}
            timeRemaining={'3 weeks'}
            imageSrc={demoImage}
            color="red"
            onClick={action('Clicked')}
          />
        </div>
      </div>
    )
  })
  .add('without image', () => {
    const frameStyle = { paddingBottom: '.5rem', color: 'white' }
    return (
      <div>
        <div style={frameStyle}>
          No color set
          <RewardSummary
            name="Razer Blackwidow Ultimate Keyboard 2018"
            price={999.99}
            redeemable={false}
            timeRemaining={'3 weeks'}
            // imageSrc={demoImage}
            onClick={action('Clicked')}
          />
        </div>
        <div style={frameStyle}>
          With color set
          <RewardSummary
            name="Razer Blackwidow Ultimate Keyboard 2018"
            price={999.99}
            redeemable={false}
            timeRemaining={'3 weeks'}
            color="purple"
            onClick={action('Clicked')}
          />
        </div>
      </div>
    )
  })

storiesOf('Modules|Reward', module)
  .add('Selected Reward', () => {
    let reward = generateRewards(1)[0]
    return (
      <div>
        <SelectedReward reward={reward} />
        <SelectedReward reward={undefined} />
      </div>
    )
  })
  .add('Reward List', () => {
    let rewards = generateRewards(20)

    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <RewardList rewards={rewards} onRewardClick={action('reward click')} />
      </div>
    )
  })
  .add('Reward Filter Page', () => {
    return (
      <div style={{ backgroundColor: '#092234' }}>
        <RewardFilterPage
          searchText={''}
          filters={getFilters}
          onTextEntered={action('text entered')}
          onToggle={action('toggle')}
        />
      </div>
    )
  })
  .add('Filter List', () => {
    return (
      <div style={{ backgroundColor: '#092234' }}>
        <FilterList filters={getFilters} onToggle={action('toggle')} />
      </div>
    )
  })
  .add('Search Bar', () => {
    let textEntered = action('text entered')

    return (
      <div style={{ backgroundColor: '#092234' }}>
        With placeholder
        <SearchBar text={''} onTextEntered={textEntered} />
        With text
        <SearchBar text={'hello world'} onTextEntered={textEntered} />
      </div>
    )
  })
