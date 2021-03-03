import { boolean, number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { StorefrontHeroItem } from './StorefrontHeroItem'

storiesOf('Modules/Storefront/Components', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Hero Item', () => {
    return (
      <StorefrontHeroItem
        altText="Discord mascot banner image"
        body={text('Body', 'You want it, we got it. Get Nitro perks with no credit card required.')}
        image="https://app-api.salad.io/api/v1/reward-images/b570ab9a-1b83-4abd-a313-41af29680e9d"
        heading={text('heading', 'Discord Nitro Classic')}
        subheading={text('Subheading', '$4.99')}
        buttonLabel={text('Button Label', 'Get It Now')}
        buttonLink="https://app.salad.io/rewards/eebc35f0-4d35-4785-bd3d-d0bd6b2f40e6"
        lowQuantity={boolean('Low Quantity', false)}
        outOfStock={boolean('Out of Stock', false)}
        quantity={number('Quantity', 500)}
      />
    )
  })
