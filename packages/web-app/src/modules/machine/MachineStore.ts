import { action, observable } from 'mobx'
import { DataResource } from '../data-refresh/models'

export class MachineStore {
  @observable
  public machineCount: number = 0

  @action
  loadDataRefresh = (data: DataResource) => {
    this.machineCount = data.machines.length
  }
}
