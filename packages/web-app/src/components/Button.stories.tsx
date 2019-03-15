import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from './Button'

storiesOf('Components/Button', module).add('default', () => {
  return (
    <div style={{ backgroundColor: 'black' }}>
      <div>
        <Button onClick={action('Clicked 1')}>Test Me 1</Button>
      </div>
      <div>
        <Button onClick={action('Clicked 1')} disabled>
          Disabled
        </Button>
      </div>
      <div>
        <Button onClick={action('Clicked 1')} loading>
          Loading
        </Button>
      </div>
    </div>
  )
})
