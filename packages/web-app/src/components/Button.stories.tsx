import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from './Button'

storiesOf('Components/Button', module).add('with text', () => {
  return (
    <div>
      <div style={{ backgroundColor: 'black' }}>
        <Button onClick={action('Clicked 1')}>Test Me 1</Button>
      </div>
      <div style={{ backgroundColor: 'black' }}>
        <Button onClick={action('Clicked 1')} disabled>
          Disabled
        </Button>
      </div>
    </div>
  )
})
