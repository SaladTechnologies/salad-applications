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
    position?: 'left' | 'right' | 'top' | 'bottom'
    image: StorefrontImageProps
  }
}

export interface StorefrontCommunityChallengeProps {
  __component: string
  id: number
  heading?: string
  content?: string
  data?: {
    data?: string
  }
}

export enum StorefrontBlockComponent {
  Content = 'storefront.content-block',
  Hero = 'storefront.carousel-block',
  Reward = 'storefront.reward-list-block',
  CommunityChallenge = 'storefront.community-challenge-block',
}
