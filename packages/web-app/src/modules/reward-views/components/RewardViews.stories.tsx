import React from 'react'
import { storiesOf } from '@storybook/react'
import { RewardSummary } from './RewardSummary'
import demoImage from '../../../../.storybook/assets/itunes-app-store-card.png'
import { action } from '@storybook/addon-actions'
import { RewardList } from './RewardList'
import { Reward } from '../../reward/models/Reward'

const generateRewards = (count: number): Reward[] => {
  let result = new Array<Reward>(count)

  for (var i = 20; i > 0; i--) {
    result[i] = {
      id: i,
      name: `$${i}.00 Salad Gift Card`,
      price: i,
      redeemable: i < count / 2,
      imageSrc: demoImage,
      remainingTimeLabel: '2 days',
    }
  }

  return result
}

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
  .add('Reward List', () => {
    let rewards = generateRewards(20)

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <RewardList rewards={rewards} />
      </div>
    )
  })
