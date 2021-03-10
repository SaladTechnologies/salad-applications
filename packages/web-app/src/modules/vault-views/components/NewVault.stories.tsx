import { storiesOf } from '@storybook/react'
import { RewardVaultStatus } from '../../vault/models'
import { NewVaultList } from './NewVaultList'

const today = new Date()

const redemptions = [
  {
    id: 'abc',
    name: 'Reward ABC',
    price: 22.2656514654,
    timestamp: today,
    status: RewardVaultStatus.PENDING,
  },
  {
    id: 'def',
    name: 'Age of Empires II: Definitive Edition - Steam Key - GLOBAL',
    price: 123.51,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 4)),
    code: 'ABC-DEF-GHI',
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: 'ghi',
    name: 'Reward GHI',
    price: 1.22,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: 'jkl',
    name: '1% for the Planent - $0.05 Donation',
    price: 0.05,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: '1111',
    name: 'Steam Gift Card',
    price: 5.0,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: '22222',
    name: 'Jedi Fallen Order',
    price: 20.25,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: 'mno',
    name: 'Reward MNO',
    price: 0.07,
    timestamp: today,
    status: RewardVaultStatus.CANCELLED,
  },
  {
    id: 'def',
    name: 'Razer Gift Card',
    price: 5.01,
    timestamp: today,
    code: 'HEF_CODE',
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: '2222ww2',
    name: 'Discord Nitro',
    price: 5,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
    status: RewardVaultStatus.COMPLETED,
  },
  {
    id: 'mnosss',
    name: 'Grand Theft Auto V',
    price: 43.07,
    timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
    status: RewardVaultStatus.CANCELLED,
  },
  {
    id: 'defsasas',
    name: 'Hulu Gift Card',
    price: 10.0,
    timestamp: today,
    code: 'HULU_CODE',
    status: RewardVaultStatus.COMPLETED,
  },
]

storiesOf('Modules/New Vault/Components', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Vault List', () => {
    return <NewVaultList redemptions={redemptions} />
  })
