import { AxiosInstance } from 'axios'
import { autorun, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { Machine } from './models/Machine'

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

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    autorun(async () => {
      if (!store.auth.isAuthenticated) {
        return
      }

      if (!store.native.machineInfo) {
        return
      }

      await this.registerMachine()
    })
  }

  registerMachine = flow(
    function* (this: MachineStore) {
      if (!this.store.native.machineInfo) {
        console.warn('No valid machine info found. Unable to register.')
        return
      }

      try {
        console.log('Registering machine with salad')
        let req = { systemInfo: this.store.native.machineInfo }
        let res: any = yield this.axios.post(`/api/v2/machines`, req)
        let machine: Machine = res.data
        this.currentMachine = machine
      } catch (err) {
        this.store.analytics.captureException(new Error(`register-machine error: ${err}`), {
          contexts: {
            machineInfo: this.store.native.machineInfo,
          },
        })
        throw err
      }
    }.bind(this),
  )
}
