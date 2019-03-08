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

storiesOf('Modules/Reward', module)
  .add('Reward Summary', () => {
    const frameStyle = { paddingBottom: '.5rem' }
    return (
      <div>
        <div style={frameStyle}>
          <RewardSummary
            name="$20 Steam Gift Card"
            price={20}
            redeemable={true}
            imageSrc={demoImage}
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
            onClick={action('Clicked')}
          />
        </div>
      </div>
    )
  })
  .add('Selected Reward', () => {
    let reward = generateRewards(1)[0]
    return (
      <div>
        <SelectedReward reward={reward} />
        <SelectedReward reward={undefined} />
      </div>
    )
  })
  .add('Reward Details Modal', () => {
    let reward = generateRewards(1)[0]
    return (
      <div>
        <RewardDetailsModal reward={reward} />
      </div>
    )
  })
  .add('Reward List', () => {
    let rewards = generateRewards(20)

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
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
