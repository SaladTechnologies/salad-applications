import { Meta } from '@storybook/react'
import { HeroPanel } from './HeroPanel'

export default {
  title: 'Components/Hero Panel',
  component: HeroPanel,
} as Meta

export const Red = () => <HeroPanel color="red">Hello world</HeroPanel>
export const Purple = () => <HeroPanel color="purple">Hello world</HeroPanel>
export const Green = () => <HeroPanel color="green">Hello world</HeroPanel>
export const Cyan = () => <HeroPanel color="cyan">Hello world</HeroPanel>
