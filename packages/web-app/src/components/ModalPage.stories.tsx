import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { ModalPage } from './ModalPage'
import { Modal } from './Modal'

storiesOf('Components/Modals', module)
  .add('Modal Page', () => {
    let show = boolean('Show', true)
    return (
      <ModalPage
        visible={show}
        content={<div style={{ backgroundColor: 'red' }}>Hello world</div>}
        onCloseClicked={action('close')}
      />
    )
  })
  .add('Modal', () => {
    return <Modal onCloseClicked={action('close')}>Hello!</Modal>
  })
