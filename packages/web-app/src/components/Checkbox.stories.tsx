import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { action } from '@storybook/addon-actions'

storiesOf('Components/Checkbox', module).add('checkboxes', () => {
  return (
    <div>
      <Checkbox checked={true} onClick={action('clicked 1')} />
      <Checkbox checked={false} onClick={action('clicked 2')} />
      <Checkbox checked={true} onClick={action('clicked 3')} />
    </div>
  )
})
