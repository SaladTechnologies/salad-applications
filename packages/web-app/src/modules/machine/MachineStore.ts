import { action, observable, computed } from 'mobx'
import { Machine } from './models/Machine'
import { RootStore } from '../../Store'

export class MachineStore {
  @observable
  public currentMachine?: Machine

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
