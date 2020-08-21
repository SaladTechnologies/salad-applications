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

      const { cpu, graphics, memLayout, os, system, uuid, version } = this.store.native.machineInfo
      try {
        console.log('Registering machine with salad')
        let res: any = yield this.axios.post(`/api/v2/machines`, {
          systemInfo: {
            cpu,
            graphics,
            memLayout,
            os,
            system,
            uuid,
            version,
          },
        })
        let machine: Machine = res.data
        this.currentMachine = machine
      } catch (err) {
        this.store.analytics.captureException(new Error(`register-machine error: ${err}`), {
          contexts: {
            machineInfo: {
              cpu,
              graphics,
              memLayout,
              os,
              system,
              uuid,
              version,
            },
          },
        })
        throw err
      }
    }.bind(this),
  )
}
