import React from 'react'
import { storiesOf } from '@storybook/react'
import skyrimCover from '../../../../.storybook/assets/skyrim-cover.jpg'
import witcherCover from '../../../../.storybook/assets/witcher-cover.jpg'
import { action } from '@storybook/addon-actions'
import { Reward } from '../../reward/models/Reward'
import { RewardCategory } from '../../reward/models/RewardCategory'
import { RewardItem } from './RewardItem'
import { RewardSlider } from './RewardSlider'
import { RewardSliderButton } from './RewardSliderButton'
import { RewardHeroItem } from './RewardHeroItem'
import { RewardHero } from './RewardHero'
import { RewardHeroButtonGroup } from './RewardHeroButtonGroup'

const generateRewards = (count: number): Reward[] => {
  let result = new Array<Reward>(count)

  for (var i = count - 1; i >= 0; i--) {
    let reward = {
      id: String(i),
      name: `Rocketcers ${i}`,
      headline: 'Discover the new Fortuna Pass, map and vehicles this season!',
      description: '',
      price: i,
      redeemable: i < count / 2,
      coverImage: i % 2 === 0 ? skyrimCover : witcherCover,
      category: RewardCategory.Game,
      checkoutTerms: ["Don't scam us"],
      tags: ['Game'],
      remainingTimeLabel: '2 days',
      percentUnlocked: 0.5,
      color: 'red',
      quantity: 3,
    }

    if (i % 2 !== 0) {
      reward.name = 'A very long name, probably the longest name that you have ever seen'
    }

    for (var x = 0; x < i; x++) {
      reward.description +=
        'A short description outlining the scope of the game, its game play and how it might work in the carousel. '
    }

    result[i] = reward
  }

  return result
}

storiesOf('Modules/Rewards/Reward Item', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardItem reward={reward} />
  })
  .add('complete reward (long name)', () => {
    let reward = generateRewards(2)[1]
    return <RewardItem reward={reward} />
  })
  .add('missing reward', () => {
    return <RewardItem />
  })
  .add('no reward image', () => {
    let reward = generateRewards(1)[0]
    reward.coverImage = ''
    return <RewardItem reward={reward} />
  })

storiesOf('Modules/Rewards/Reward Slider', module)
  .add('with 1 item', () => {
    let reward = generateRewards(1)[0]
    return (
      <RewardSlider>
        <RewardItem reward={reward} />
      </RewardSlider>
    )
  })
  .add('with multiple items', () => {
    let rewards = generateRewards(10)
    return (
      <RewardSlider>
        {rewards.map(x => (
          <RewardItem reward={x} />
        ))}
      </RewardSlider>
    )
  })
  .add('multiple sliders', () => {
    let rewards = generateRewards(10)
    return (
      <>
        <RewardSlider title={'Category 1'}>
          {rewards.map(x => (
            <RewardItem reward={x} />
          ))}
        </RewardSlider>
        <RewardSlider title={'Category 2'}>
          {rewards.map(x => (
            <RewardItem reward={x} />
          ))}
        </RewardSlider>
        <RewardSlider title={'Category 3'}>
          {rewards.map(x => (
            <RewardItem reward={x} />
          ))}
        </RewardSlider>
      </>
    )
  })

storiesOf('Modules/Rewards/Reward Hero Item', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardHeroItem reward={reward} onViewReward={action('view reward')} onSelect={action('select')} />
  })
  .add('complete reward (long name)', () => {
    let reward = generateRewards(2)[1]
    return <RewardHeroItem reward={reward} onViewReward={action('view reward')} onSelect={action('select')} />
  })
  .add('missing reward', () => {
    return <RewardHeroItem onViewReward={action('view reward')} onSelect={action('select')} />
  })
  .add('no reward image', () => {
    let reward = generateRewards(1)[0]
    reward.coverImage = ''
    return <RewardHeroItem reward={reward} onViewReward={action('view reward')} onSelect={action('select')} />
  })
  .add('no headline', () => {
    let reward = generateRewards(1)[0]
    reward.headline = undefined
    return <RewardHeroItem reward={reward} onViewReward={action('view reward')} onSelect={action('select')} />
  })

storiesOf('Modules/Rewards/Reward Hero', module)
  .add('with 1 item', () => {
    let reward = generateRewards(1)[0]
    return (
      <RewardHero>
        <RewardHeroItem reward={reward} onViewReward={action('view reward')} onSelect={action('select')} />
      </RewardHero>
    )
  })
  .add('with multiple items (no title)', () => {
    let rewards = generateRewards(10)
    return (
      <RewardHero>
        {rewards.map(x => (
          <RewardHeroItem reward={x} onViewReward={action('view reward')} onSelect={action('select')} />
        ))}
      </RewardHero>
    )
  })
  .add('with multiple items (w/ title)', () => {
    let rewards = generateRewards(10)
    return (
      <RewardHero title="Hero Title">
        {rewards.map(x => (
          <RewardHeroItem reward={x} onViewReward={action('view reward')} onSelect={action('select')} />
        ))}
      </RewardHero>
    )
  })
  .add('multiple sliders', () => {
    let rewards = generateRewards(10)
    return (
      <>
        <RewardHero title={'Category 1'}>
          {rewards.map(x => (
            <RewardHeroItem reward={x} onViewReward={action('view reward')} onSelect={action('select')} />
          ))}
        </RewardHero>
        <RewardHero title={'Category 2'}>
          {rewards.map(x => (
            <RewardHeroItem reward={x} onViewReward={action('view reward')} onSelect={action('select')} />
          ))}
        </RewardHero>
        <RewardHero title={'Category 3'}>
          {rewards.map(x => (
            <RewardHeroItem reward={x} onViewReward={action('view reward')} onSelect={action('select')} />
          ))}
        </RewardHero>
      </>
    )
  })

storiesOf('Modules/Rewards/Reward Slider Button', module)
  .add('both', () => {
    return (
      <>
        <RewardSliderButton onClick={action('click')} direction={'left'} />
        <RewardSliderButton onClick={action('click')} direction={'right'} />
      </>
    )
  })
  .add('left', () => {
    return <RewardSliderButton onClick={action('click')} direction={'left'} />
  })
  .add('right', () => {
    return <RewardSliderButton onClick={action('click')} direction={'right'} />
  })

storiesOf('Modules/Rewards/Reward Hero Button Group', module).add('both', () => {
  return <RewardHeroButtonGroup next={action('next')} previous={action('prev')} />
})
