import { boolean, number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { StorefrontRewardItem } from './StorefrontRewardItem'

storiesOf('Modules/Storefront/Components', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Reward Item', () => {
    return (
      <div style={{ height: 300 }}>
        <StorefrontRewardItem
          name={text('Name', 'A Way Out')}
          image="https://app-api.salad.io/api/v1/reward-images/1f0ca1d5-4006-4f44-bca5-bf8f4be4eb5e"
          price={text('Subheading', '$4.99')}
          link="https://app.salad.io/rewards/4fa2a0c6-fec2-4bb9-af5b-9308e05c8e96"
          lowQuantity={boolean('Low Quantity', false)}
          outOfStock={boolean('Out of Stock', false)}
          quantity={number('Quantity', 500)}
        />
      </div>
    )
  })
