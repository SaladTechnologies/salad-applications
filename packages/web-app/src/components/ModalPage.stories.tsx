import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { ModalPage } from './ModalPage'

storiesOf('Modules/Modal', module).add('Modal Page', () => {
  let show = boolean('Show', true)
  return (
    <ModalPage
      visible={show}
      content={<div style={{ backgroundColor: 'red' }}>Hello world</div>}
      onCloseClicked={action('close')}
    />
  )
})
