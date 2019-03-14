import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { action } from '@storybook/addon-actions'

storiesOf('Components/Checkbox', module)
  .add('checkboxes', () => {
    return (
      <div>
        <Checkbox checked={true} onClick={action('clicked 1')} text={'Text goes here'} />
        <Checkbox checked={false} onClick={action('clicked 2')} />
        <Checkbox checked={true} onClick={action('clicked 3')} />
      </div>
    )
  })
  .add('with error', () => {
    return (
      <div>
        <Checkbox
          checked={true}
          onClick={action('clicked 1')}
          text={'Texty text goes here'}
          errorText={'Error goes here'}
        />
        <Checkbox checked={false} onClick={action('clicked 2')} errorText={'Error goes here'} />
        <Checkbox checked={true} onClick={action('clicked 3')} errorText={'Error goes here'} />
      </div>
    )
  })
