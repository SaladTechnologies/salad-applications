import { Fragment } from 'react'
import { rewardRoute } from '../../../RouteUtils'
import type { StorefrontRewardBlockProps } from '../../storefront/models'
import { StorefrontRewardItem } from '../components/StorefrontRewardItem'
import { StorefrontRewardSlider } from '../components/StorefrontRewardSlider'

interface Props {
  block: StorefrontRewardBlockProps
}

export const StorefrontRewardBlock = ({ block }: Props) => {
  return (
    <Fragment key={block.id}>
      <StorefrontRewardSlider
        key={block.id}
        title={block.title}
        viewAllRoute={block.buttons ? block.buttons[0]?.link : undefined}
        viewAllTitle={block.buttons ? block.buttons[0]?.label : undefined}
      >
        {block.rewards.map((reward) => {
          const outOfStock = reward?.quantity === 0
          const lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0
          const price = reward?.price ? `$${reward?.price.toFixed(2)}` : 'FREE'
          const originalPrice = reward?.originalPrice ? `$${reward?.originalPrice}` : undefined
          const link = rewardRoute(reward.uuid)
          const rewardData = reward
          return (
            <StorefrontRewardItem
              key={reward.id}
              image={reward?.coverImage}
              lowQuantity={lowQuanity}
              outOfStock={outOfStock}
              name={reward?.name}
              price={price}
              originalPrice={originalPrice}
              rewardData={rewardData}
              link={link}
              quantity={reward?.quantity}
            />
          )
        })}
      </StorefrontRewardSlider>
    </Fragment>
  )
}
