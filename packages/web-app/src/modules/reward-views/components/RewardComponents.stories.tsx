import React from 'react'
import { storiesOf } from '@storybook/react'
import { LoremIpsum } from 'lorem-ipsum'
import skyrimCover from '../../../../.storybook/assets/skyrim-cover.jpg'
import witcherCover from '../../../../.storybook/assets/witcher-cover.jpg'
import gta1 from '../../../../.storybook/assets/gta-1.jpg'
import gta2 from '../../../../.storybook/assets/gta-2.jpg'
import gta3 from '../../../../.storybook/assets/gta-3.jpg'
import gta4 from '../../../../.storybook/assets/gta-4.jpg'
import gta5 from '../../../../.storybook/assets/gta-5.jpg'
import gta6 from '../../../../.storybook/assets/gta-6.jpg'
import gta7 from '../../../../.storybook/assets/gta-7.jpg'
import gta8 from '../../../../.storybook/assets/gta-8.jpg'
import { action } from '@storybook/addon-actions'
import { Reward } from '../../reward/models/Reward'
import { RewardCategory } from '../../reward/models/RewardCategory'
import { RewardItem } from './RewardItem'
import { RewardSlider } from './RewardSlider'
import { RewardSliderButton } from './RewardSliderButton'
import { RewardHeroItem } from './RewardHeroItem'
import { RewardHero } from './RewardHero'
import { RewardHeroButtonGroup } from './RewardHeroButtonGroup'
import { RewardHeaderBar, RewardInfoPanel, RewardDescriptionPanel, RewardRequirementsPanel } from '.'
import { RewardImageCarousel } from './RewardImageCarousel'
import { RewardPlatform } from '../../reward/models'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
})

export const generateRewards = (count: number): Reward[] => {
  let result = new Array<Reward>(count)

  for (var i = count - 1; i >= 0; i--) {
    let reward = {
      id: String(i),
      name: `Rocketcers ${i}`,
      headline: 'Discover the new Fortuna Pass, map and vehicles this season!',
      releaseDate: new Date(i + 2000, 0),
      developer: `Bob's Cool Games`,
      publisher: 'Salad Technologies',
      platform: RewardPlatform.Steam,
      description: lorem.generateParagraphs(20),
      price: i,
      redeemable: i < count / 2,
      coverImage: i % 2 === 0 ? skyrimCover : witcherCover,
      images: [gta1, gta2, gta3, gta4, gta5, gta6, gta7, gta8],
      videos: ['https://www.youtube.com/watch?v=xZzhFnEbfIc', 'https://www.youtube.com/embed/1xjCdN_rWCE'],
      category: RewardCategory.Game,
      checkoutTerms: ["Don't scam us"],
      tags: ['Game'],
      remainingTimeLabel: '2 days',
      percentUnlocked: 0.5,
      color: 'red',
      quantity: 3,
      requirements: {
        systems: new Map([
          [
            'Windows',
            {
              minimum: {
                processor: 'Intel Core 2 Duo 2.4GHz or AMD Athlon X2 5400+',
                graphics: 'AMD HD2600 or NVIDIA Geforce 8600',
                memory: '2 GB RAM',
                diskSpace: '5 GB',
                os: 'Windows Vista or Windows 7',
                other: 'Run Salad',
              },
              recommended: {
                processor: 'Intel Core i7/AMD Bulldozer',
                graphics: 'AMD HD6000 Series/Nvidia GTX500 Series',
                memory: '4 GB RAM',
                diskSpace: '5 GB',
                os: 'Windows Vista or Windows 7 64 bit',
                other: '',
              },
            },
          ],
          [
            'MAC OS',
            {
              minimum: {
                processor: 'MAC processor 1',
                graphics: `Ummm. It's a MAC`,
                memory: '2 GB RAM',
                diskSpace: '128 GB',
                os: '10.12.6',
                other: '',
              },
              recommended: {
                processor: 'MAC processor 2',
                graphics: 'How much did you spend??',
                memory: '4 GB RAM',
                diskSpace: '256 GB',
                os: '10.12.6',
                other: 'A mouse',
              },
            },
          ],
        ]),
      },
    }

    if (i % 2 !== 0) {
      reward.name = 'A very long name, probably the longest name that you have ever seen'
    }

    result[i] = reward
  }

  return result
}

storiesOf('Modules/Rewards/Reward Item', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardItem reward={reward} onViewReward={action('view reward')} />
  })
  .add('complete reward (long name)', () => {
    let reward = generateRewards(2)[1]
    return <RewardItem reward={reward} onViewReward={action('view reward')} />
  })
  .add('missing reward', () => {
    return <RewardItem onViewReward={action('view reward')} />
  })
  .add('no reward image', () => {
    let reward = generateRewards(1)[0]
    reward.coverImage = ''
    return <RewardItem reward={reward} onViewReward={action('view reward')} />
  })

storiesOf('Modules/Rewards/Reward Slider', module)
  .add('with 1 item', () => {
    let reward = generateRewards(1)[0]
    return (
      <RewardSlider>
        <RewardItem reward={reward} onViewReward={action('view reward')} />
      </RewardSlider>
    )
  })
  .add('with multiple items', () => {
    let rewards = generateRewards(10)
    return (
      <RewardSlider>
        {rewards.map(x => (
          <RewardItem reward={x} onViewReward={action('view reward')} />
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
            <RewardItem reward={x} onViewReward={action('view reward')} />
          ))}
        </RewardSlider>
        <RewardSlider title={'Category 2'}>
          {rewards.map(x => (
            <RewardItem reward={x} onViewReward={action('view reward')} />
          ))}
        </RewardSlider>
        <RewardSlider title={'Category 3'}>
          {rewards.map(x => (
            <RewardItem reward={x} onViewReward={action('view reward')} />
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

storiesOf('Modules/Rewards/Reward Header Bar', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardHeaderBar reward={reward} onBack={action('back')} onRedeem={action('redeem')} />
  })
  .add('complete reward (long name)', () => {
    let reward = generateRewards(2)[1]
    return <RewardHeaderBar reward={reward} onBack={action('back')} onRedeem={action('redeem')} />
  })
  .add('blank name', () => {
    let reward = generateRewards(2)[1]
    reward.name = ''
    return <RewardHeaderBar reward={reward} onBack={action('back')} onRedeem={action('redeem')} />
  })

storiesOf('Modules/Rewards/Reward Image Carousel', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardImageCarousel reward={reward} />
  })
  .add('no images (undefined)', () => {
    let reward = generateRewards(2)[1]
    reward.images = undefined
    return <RewardImageCarousel reward={reward} />
  })
  .add('videos (undefined)', () => {
    let reward = generateRewards(2)[1]
    reward.videos = undefined
    return <RewardImageCarousel reward={reward} />
  })
  .add('no images or videos (undefined)', () => {
    let reward = generateRewards(2)[1]
    reward.images = undefined
    reward.videos = undefined
    return <RewardImageCarousel reward={reward} />
  })
  .add('no images or videos (empty)', () => {
    let reward = generateRewards(2)[1]
    reward.images = []
    reward.videos = []
    return <RewardImageCarousel reward={reward} />
  })

storiesOf('Modules/Rewards/Reward Info Panel', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardInfoPanel reward={reward} />
  })
  .add('no release date', () => {
    let reward = generateRewards(1)[0]
    reward.releaseDate = undefined
    return <RewardInfoPanel reward={reward} />
  })
  .add('no developer', () => {
    let reward = generateRewards(1)[0]
    reward.developer = undefined
    return <RewardInfoPanel reward={reward} />
  })
  .add('no publisher', () => {
    let reward = generateRewards(1)[0]
    reward.publisher = undefined
    return <RewardInfoPanel reward={reward} />
  })
  .add('no platform', () => {
    let reward = generateRewards(1)[0]
    reward.platform = undefined
    return <RewardInfoPanel reward={reward} />
  })

storiesOf('Modules/Rewards/Reward Description Panel', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardDescriptionPanel reward={reward} />
  })
  .add('no description (undefined)', () => {
    let reward = generateRewards(1)[0]
    reward.description = undefined
    return <RewardDescriptionPanel reward={reward} />
  })
  .add('no description (blank)', () => {
    let reward = generateRewards(1)[0]
    reward.description = ''
    return <RewardDescriptionPanel reward={reward} />
  })

storiesOf('Modules/Rewards/Reward Specifications Panel', module)
  .add('complete reward', () => {
    let reward = generateRewards(1)[0]
    return <RewardRequirementsPanel reward={reward} />
  })
  .add('no requirements', () => {
    let reward = generateRewards(1)[0]
    reward.requirements = undefined
    return <RewardRequirementsPanel reward={reward} />
  })
  .add('no system requirements (blank)', () => {
    let reward = generateRewards(1)[0]
    if (reward.requirements) {
      reward.requirements.systems = undefined
    }
    return <RewardRequirementsPanel reward={reward} />
  })
