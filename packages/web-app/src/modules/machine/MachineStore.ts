import { action, observable, computed } from 'mobx'
import { Machine } from './models/Machine'

export class MachineStore {
  @observable
  public currentMachine?: Machine

  @computed
  get currentEarningRate(): number {
    return this.currentMachine ? this.currentMachine.earningRate : 0
  }

  @action
  setCurrentMachine = (machine: Machine) => {
    this.currentMachine = machine
  }
}
