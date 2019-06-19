import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Overlay } from './Overlay'

storiesOf('Components/Overlay', module)
  .add('Overlay', () => {
    return <Overlay onCloseClicked={action('close')}>Hello!</Overlay>
  })
