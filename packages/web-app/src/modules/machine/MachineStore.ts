import { action, observable, runInAction } from 'mobx'
import { ReactNode } from 'react'
import uuidv1 from 'uuid/v1'
import * as Storage from '../../Storage'

export class MachineStore {
  @observable
  public installId?: string

  constructor() {
    runInAction(() => {
      this.installId = Storage.getOrDefault('INSTALL_ID', uuidv1())
    })
  }

  @action
  showModal = (modal: ReactNode) => {
    // this.modal = modal
  }

  @action
  clearModal = () => {
    // this.modal = undefined
  }
}
