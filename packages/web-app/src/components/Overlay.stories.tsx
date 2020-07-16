import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Overlay } from './Overlay'

storiesOf('Components/Overlay', module).add('Overlay', () => {
  return <Overlay onCloseRequested={action('close')}>Hello!</Overlay>
})
