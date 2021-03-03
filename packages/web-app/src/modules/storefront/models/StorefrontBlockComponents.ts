import { StorefrontHeroItemProps, StorefrontImageProps, StorefrontRewardItemProps } from './index'

export interface StrapiBlock {
  __component: string
  id: number
  title: string
}

export interface StorefrontHeroBlockProps extends StrapiBlock {
  items: StorefrontHeroItemProps[]
}

export interface StorefrontRewardBlockProps extends StrapiBlock {
  buttons: { id: number; label: string; link: string }[]
  rewards: StorefrontRewardItemProps[]
}

export interface StorefrontContentBlockProps extends StrapiBlock {
  body: string
  color: 'red' | 'purple' | 'green' | 'cyan'
  image?: {
    id: number
    postion?: 'left' | 'right' | 'top' | 'bottom'
    image: StorefrontImageProps
  }
}

export enum StorefrontBlockComponent {
  Content = 'storefront.content-block',
  Hero = 'storefront.carousel-block',
  Reward = 'storefront.reward-list-block',
}
