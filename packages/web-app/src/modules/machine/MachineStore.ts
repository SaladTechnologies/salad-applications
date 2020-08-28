import { AxiosInstance } from 'axios'
import { autorun, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { getPluginDefinitions, getPluginDefinitionsForGraphics } from '../salad-bowl/PluginDefinitionFactory'
import { GpuInformation } from './models'
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

        //Check the machine for compatibility
        const pluginCount = getPluginDefinitions(this.store).length

        if (pluginCount === 0) {
          //Show an error notification
          this.store.notifications.sendNotification({
            title: `Machine is Incompatible`,
            message: 'Salad was unable to detect a compatible graphics card. Click here for more details.',
            autoClose: false,
            type: 'error',
            onClick: () => this.store.routing.push('/earn/mine/miner-details'),
          })
        }
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

  @computed
  get gpus(): GpuInformation[] {
    if (!this.store.native.machineInfo) return []
    if (!this.currentMachine) return []

    const gpus = this.store.native.machineInfo.graphics?.controllers.map((x) => {
      let compatible = false

      if (this.currentMachine) {
        //Get all the miner plugins for each graphics card
        const plugins = getPluginDefinitionsForGraphics(this.currentMachine, [x])

        compatible = plugins.length > 0
      }

      //Return the GPU information for this graphics card
      return {
        model: x.model,
        vram: x.memoryTotal || x.vram,
        driverVersion: x.driverVersion,
        compatible: compatible,
      }
    })

    return gpus || []
  }
}
