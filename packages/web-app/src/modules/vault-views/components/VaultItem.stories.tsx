import { storiesOf } from '@storybook/react'
import { addStories } from '../../../../.storybook/addStories'
import { VaultItem } from './VaultItem'

const stories = [
  {
    name: 'With code',
    props: { id: 'abc', name: 'Reward ABC', price: 22.2656514654, timestamp: new Date(), code: 'ABC-DEF-GHI' },
  },
  {
    name: 'With link',
    props: {
      id: 'abc',
      name: 'Reward ABC',
      price: 22.2656514654,
      timestamp: new Date(),
      code: 'https://salad.io',
    },
  },
  {
    name: 'No code',
    props: { id: 'abc', name: 'Reward ABC', price: 22.2656514654, timestamp: new Date() },
  },
]

// @ts-ignore
addStories(VaultItem, stories, storiesOf('Modules|Vault/Vault Item', module))
// storiesOf('Components/ToggleSwitch', module).addStories(ToggleSwitch,stories)
