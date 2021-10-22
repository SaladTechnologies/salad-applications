import { Modal as GardenModal } from '@saladtechnologies/garden-components'

export interface ModalProps {
  backgroundColor?: string
  hideModal: () => void
  ModalContentComponent: React.ElementType
  onClose?: () => void
  showModal: boolean
  title?: string
}

export const Modal = ({ backgroundColor, hideModal, ModalContentComponent, onClose, showModal, title }: ModalProps) => {
  const handleClose = () => {
    hideModal()
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {showModal && (
        <GardenModal title={title} onClose={handleClose} background={backgroundColor}>
          <ModalContentComponent />
        </GardenModal>
      )}
    </>
  )
}
