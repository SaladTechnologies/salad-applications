import { action, observable, computed } from 'mobx'
import { DataResource } from '../data-refresh/models'
import { Machine } from './models/Machine'

export class MachineStore {
  @observable
  public machineCount: number = 0

  @observable
  public currentMachine?: Machine

  @computed
  get currentEarningRate(): number {
    return this.currentMachine ? this.currentMachine.earningRate : 0
  }

  @action
  loadDataRefresh = (data: DataResource) => {
    this.machineCount = data.machines.length
  }

  @action
  setCurrentMachine = (machine: Machine) => {
    this.currentMachine = machine
  }
}
