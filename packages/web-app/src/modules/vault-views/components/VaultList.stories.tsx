import { storiesOf } from '@storybook/react'
import { addStories } from '../../../../.storybook/addStories'
import { VaultList } from './VaultList'

const redemptions = [
  { id: 'abc', name: 'Reward ABC', price: 22.2656514654, timestamp: new Date(), code: 'ABC-DEF-GHI' },
  { id: 'def', name: 'Reward DEF', price: 123.51, timestamp: new Date(), code: 'ABC-DEF-GHI' },
  { id: 'ghi', name: 'Reward GHI', price: 1.22, timestamp: new Date() },
  { id: 'jkl', name: 'Reward JKL', price: 0.16, timestamp: new Date(), code: 'https://salad.io' },
  { id: 'mno', name: 'Reward MNO', price: 0.07, timestamp: new Date() },
]

const stories = [
  {
    name: 'With redemptions',
    props: { redemptions: redemptions },
  },
  {
    name: 'No redemptions',
    props: {},
  },
]

// @ts-ignore
addStories(VaultList, stories, storiesOf('Modules|Vault/Vault List', module))
// storiesOf('Components/ToggleSwitch', module).addStories(ToggleSwitch,stories)
