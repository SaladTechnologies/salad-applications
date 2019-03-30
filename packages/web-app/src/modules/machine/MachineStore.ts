import { action, observable, runInAction } from 'mobx'
import uuidv1 from 'uuid/v1'
import * as Storage from '../../Storage'
import { DataResource } from '../data-refresh/models'

export class MachineStore {
  @observable
  public installId?: string

  @observable
  public machineCount: number = 0

  constructor() {
    runInAction(() => {
      this.installId = Storage.getOrSetDefault('INSTALL_ID', uuidv1())
    })
  }

  @action
  loadDataRefresh = (data: DataResource) => {
    this.machineCount = data.machines.length
  }
}
