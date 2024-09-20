import { config } from '../../../config'
import { rewardRoute } from '../../../RouteUtils'
import type { StorefrontHeroBlockProps } from '../../storefront/models'
import { StorefrontHero } from '../components/StorefrontHero'
import { StorefrontHeroItem } from '../components/StorefrontHeroItem'

interface Props {
  block: StorefrontHeroBlockProps
}

export const StorefrontHeroBlock = ({ block }: Props) => {
  return (
    <StorefrontHero key={block.id} title={block.title}>
      {block.items.map((hero) => {
        const heading = hero.heading || hero.reward?.name
        const subHeading = hero.subheading
          ? hero.subheading
          : hero.reward?.price
          ? `$${hero.reward?.price.toFixed(2)}`
          : undefined
        const buttonLink = hero.button_link || rewardRoute(hero.reward?.uuid)
        const image = hero.image?.url ? new URL(hero.image?.url, config.strapiUploadUrl).href : hero.reward?.heroImage
        const outOfStock = hero.reward?.quantity === 0
        const lowQuanity = hero.reward?.quantity !== undefined && hero.reward.quantity > 0
        const reward = hero.reward
        return (
          <StorefrontHeroItem
            key={hero.id}
            altText={hero.image?.alternativeText || ''}
            body={hero.body}
            buttonLabel={hero.button_label}
            buttonLink={buttonLink}
            heading={heading}
            image={image}
            lowQuantity={lowQuanity}
            outOfStock={outOfStock}
            subheading={subHeading}
            quantity={hero.reward?.quantity}
            reward={reward}
          />
        )
      })}
    </StorefrontHero>
  )
}
