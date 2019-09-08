import { action, observable, computed } from 'mobx'
import { Machine } from './models/Machine'
import { RootStore } from '../../Store'

export class MachineStore {
  @observable
  public currentMachine?: Machine

  @computed
  get currentEarningRate(): string {
    let earningRate = 'Loading'

    if (this.store.native.machineInfo) {
      if (this.currentMachine) {
        if (this.currentMachine.earningRate) {
          earningRate = `$${(this.currentMachine.earningRate * 86400).toFixed(3)}/day`
        } else {
          earningRate = '$0.000/day'
        }
      }
    }

    return earningRate
  }

  constructor(private readonly store: RootStore) {}

  @action
  setCurrentMachine = (machine: Machine) => {
    this.currentMachine = machine
  }
}
