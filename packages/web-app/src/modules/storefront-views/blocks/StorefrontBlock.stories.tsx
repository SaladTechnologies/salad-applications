import { storiesOf } from '@storybook/react'
import { StorefrontBlockComponent } from '../../storefront/models'
import { getMockStrapiBlockData } from '../utils'
import { StorefrontContentBlock, StorefrontHeroBlock, StorefrontRewardBlock } from './'

storiesOf('Modules/Storefront/Blocks', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Hero Block', () => {
    return <StorefrontHeroBlock block={getMockStrapiBlockData(StorefrontBlockComponent.Hero)} />
  })
  .add('Reward Block', () => {
    return <StorefrontRewardBlock block={getMockStrapiBlockData(StorefrontBlockComponent.Reward)} />
  })
  .add('Content Block', () => {
    return <StorefrontContentBlock block={getMockStrapiBlockData(StorefrontBlockComponent.Content)} />
  })
