import { action, observable, computed } from 'mobx'
import { Machine } from './models/Machine'
import { RootStore } from '../../Store'

export class MachineStore {
  @observable
  public currentMachine?: Machine

  @computed
  get currentEarningRate(): number | undefined {
    console.log('++---> this.store.native.machineInfo: ', this.store.native.machineInfo)
    console.log('++---> this.currentMachine: ', this.currentMachine)
    console.log('++---> this.currentMachine.earningRate: ', this.currentMachine && this.currentMachine.earningRate)

    if (this.store.native.machineInfo && this.currentMachine && this.currentMachine.earningRate) {
      return this.currentMachine.earningRate
    } else {
      return undefined
    }
  }

  @computed
  get currentEarningRatePerDay(): number | undefined {
    const earningRate = this.currentEarningRate ? +(this.currentEarningRate * 86400).toFixed(3) : undefined
    return earningRate
  }

  @computed
  get minerId(): string | undefined {
    if (this.store.machine.currentMachine !== undefined) {
      return this.store.machine.currentMachine.minerId
    } else {
      return undefined
    }
  }

  constructor(private readonly store: RootStore) {}

  @action
  setCurrentMachine = (machine: Machine) => {
    this.currentMachine = machine
  }
}
