import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react'
import { MiningHero } from '.'

export default {
  title: 'Modules/Heroes/Mining Hero',
  component: MiningHero,
} as Meta

export const Default = () => <MiningHero isRunning={boolean('Is Salad Running', false)} />
