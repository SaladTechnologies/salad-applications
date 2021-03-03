import {
  StorefrontContentBlockProps,
  StorefrontHeroBlockProps,
  StorefrontRewardBlockProps,
} from './StorefrontBlockComponents'

export interface StorefrontPageProps {
  blocks: (StorefrontHeroBlockProps | StorefrontRewardBlockProps | StorefrontContentBlockProps)[]
  created_at: string
  id: number
  updated_at: string
}
