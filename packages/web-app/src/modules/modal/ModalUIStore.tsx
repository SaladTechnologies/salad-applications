import { action, observable } from 'mobx'
// import { RootStore } from '../../Store'

interface ModalContentProps {
  backgroundColor?: string
  content: React.ElementType
  onClose?: () => void
  title?: string
}

export class ModalUIStore {
  @observable
  modalContent?: ModalContentProps

  @observable
  show: boolean = false

  @action
  public showModal = (modalContent: ModalContentProps) => {
    this.modalContent = modalContent
    this.show = true
  }

  @action
  public hideModal = () => {
    this.modalContent = undefined
    this.show = false
  }
}
