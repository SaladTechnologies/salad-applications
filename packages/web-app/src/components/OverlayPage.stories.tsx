import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { OverlayPage } from './OverlayPage'
import { Overlay } from './Overlay'

storiesOf('Components/Overlay', module)
  .add('Overlay Page', () => {
    return (
      <OverlayPage onCloseClicked={action('close')}>
        <div style={{ backgroundColor: 'red' }}>Hello world</div>
      </OverlayPage>
    )
  })
  .add('Overlay', () => {
    return <Overlay onCloseClicked={action('close')}>Hello!</Overlay>
  })
