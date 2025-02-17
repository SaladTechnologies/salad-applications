import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import { Select } from './Select'

export default {
  title: 'Components/Select',
  component: Select,
} as Meta

const options = [
  { label: 'Default', value: 'Option 1' },
  { label: 'Name', value: 'Option 2' },
  { label: 'Highest Price', value: 'Option 3' },
  { label: 'Lowest Price', value: 'Option 4' },
]

export const empty = () => <Select />
export const withOptions = () => <Select options={options} onChange={action('selected')} />
