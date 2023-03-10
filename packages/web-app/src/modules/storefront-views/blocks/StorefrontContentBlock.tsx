import { config } from '../../../config'
import type { StorefrontContentBlockProps } from '../../storefront/models'
import { StorefrontContentPanel } from '../components/StorefrontContentPanel'

interface Props {
  block: StorefrontContentBlockProps
}

export const StorefrontContentBlock = ({ block }: Props) => {
  const image = block.image?.image.url ? new URL(block.image?.image.url, config.strapiUploadUrl).href : undefined
  return (
    <StorefrontContentPanel
      body={block.body}
      color={block.color}
      title={block.title}
      image={image}
      imagePosition={block.image?.position}
    />
  )
}
