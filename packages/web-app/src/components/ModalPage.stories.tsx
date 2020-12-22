import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Modal } from './Modal'
import { ModalPage } from './ModalPage'

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
