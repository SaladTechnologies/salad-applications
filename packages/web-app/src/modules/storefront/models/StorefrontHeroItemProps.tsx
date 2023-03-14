import type { StorefrontRewardItemProps } from './StorefrontRewardItemProps'

export interface StorefrontHeroItemProps {
  id: number
  heading?: string
  subheading: string
  body: string
  button_label: string
  button_link: string
  reward?: StorefrontRewardItemProps
  image: {
    id: number
    name: string
    alternativeText: string
    caption: string
    width: number
    height: number
    formats: {
      thumbnail: {
        name: string
        hash: string
        ext: '.png' | '.jpg' | '.png'
        mime: string
        width: number
        height: number
        size: number
        path?: string
        url: string
      }
      medium: {
        name: string
        hash: string
        ext: '.png' | '.jpg' | '.png'
        mime: string
        width: number
        height: number
        size: number
        path?: string
        url: string
      }
      small: {
        name: string
        hash: string
        ext: '.png' | '.jpg' | '.png'
        mime: string
        width: number
        height: number
        size: number
        path?: string
        url: string
      }
    }
    hash: string
    ext: '.png' | '.jpg' | '.png'
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    provider_metadata?: string
    created_at: string
    updated_at: string
  }
}
