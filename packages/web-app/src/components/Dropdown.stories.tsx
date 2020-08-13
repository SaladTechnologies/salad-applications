import { action } from '@storybook/addon-actions'
import React from 'react'
import { Dropdown } from './Dropdown'

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
}

const options = [
  { label: 'Default', value: 'Option 1' },
  { label: 'Name', value: 'Option 2' },
  { label: 'Highest Price', value: 'Option 3' },
  { label: 'Lowest Price', value: 'Option 4' },
]

export const empty = () => <Dropdown />
export const withOptions = () => <Dropdown options={options} onChange={action('selected')} />
