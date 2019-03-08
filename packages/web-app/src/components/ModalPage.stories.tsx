import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ModalPage } from './ModalPage'
import { Modal } from './Modal'

storiesOf('Components/Modals', module)
  .add('Modal Page', () => {
    return (
      <ModalPage onCloseClicked={action('close')}>
        <div style={{ backgroundColor: 'red' }}>Hello world</div>
      </ModalPage>
    )
  })
  .add('Modal', () => {
    return <Modal onCloseClicked={action('close')}>Hello!</Modal>
  })
