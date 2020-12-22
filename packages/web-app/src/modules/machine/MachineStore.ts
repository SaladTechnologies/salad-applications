import { AxiosInstance } from 'axios'
import { autorun, computed, flow, observable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { getPluginDefinitions } from '../salad-bowl/definitions'
import { GpuInformation, MachineInfo } from './models'
import { Machine } from './models/Machine'

const SYSTEM_ID = 'SYSTEM_UUID'

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
      const machineInfo = this.store.native.machineInfo
      if (!machineInfo) {
        console.warn('No valid machine info found. Unable to register.')
        return
      }

      const { services: _, ...machineWithoutServices } = machineInfo
      if (machineWithoutServices.system != null) {
        machineWithoutServices.system.uuid = Storage.getOrSetDefault(SYSTEM_ID, uuidv4())
      }

      try {
        console.log('Registering machine with salad')
        let res: any = yield this.axios.post(`/api/v2/machines`, {
          systemInfo: machineWithoutServices,
        })
        let machine: Machine = res.data
        this.currentMachine = machine

        if (!this.store.saladBowl.canRun) {
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
            machineInfo: machineWithoutServices as Record<string, unknown>,
          },
        })
        throw err
      }
    }.bind(this),
  )

  @computed
  get gpus(): GpuInformation[] {
    const machine = this.currentMachine
    const machineInfo = this.store.native.machineInfo
    if (
      machine === undefined ||
      machineInfo?.graphics?.controllers === undefined ||
      machineInfo?.graphics?.displays === undefined
    ) {
      return []
    }

    const pluginDefinitions = getPluginDefinitions(machine, machineInfo)
    const gpus = machineInfo.graphics.controllers.map((gpu) => {
      const gpuMachineInfo: MachineInfo = {
        ...machineInfo,
        graphics: {
          ...machineInfo.graphics!,
          controllers: [gpu],
        },
      }

      // TODO: Feed user preferences into the requirements check.
      const gpuPluginDefinitions = pluginDefinitions.filter((pluginDefinition) =>
        pluginDefinition.requirements.every((requirement) => requirement(gpuMachineInfo, { cpu: false, gpu: true })),
      )

      return {
        model: gpu.model,
        // @ts-ignore
        vram: gpu.memoryTotal || gpu.vram,
        // @ts-ignore
        driverVersion: gpu.driverVersion,
        compatible: gpuPluginDefinitions.length > 0,
      }
    })

    return gpus || []
  }

  @computed
  get cpuCompatible(): boolean {
    const machine = this.currentMachine
    const machineInfo = this.store.native.machineInfo
    if (
      machine === undefined ||
      machineInfo?.cpu?.brand === undefined ||
      machineInfo?.memLayout === undefined ||
      machineInfo?.memLayout?.length === 0
    ) {
      return false
    }

    const pluginDefinitions = getPluginDefinitions(machine, machineInfo)

    //Get all the CPU only plugin definitions
    const cpuPlugins = pluginDefinitions.filter((pluginDefinition) =>
      pluginDefinition.requirements.every((requirement) => requirement(machineInfo, { cpu: true, gpu: false })),
    )

    return cpuPlugins.length > 0
  }
}
