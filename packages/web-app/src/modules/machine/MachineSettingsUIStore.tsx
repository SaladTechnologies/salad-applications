import { action, computed } from 'mobx'
import { RootStore } from '../../Store'
import { MinerWorkload, ProcessorInformation } from './models'

export class MachineSettingsUIStore {
  @computed
  get cpuProcessorInfo(): ProcessorInformation | undefined {
    const cpu = this.store.native.machineInfo?.cpu

    if (cpu) {
      return {
        name: cpu.brand,
        temperature: undefined,
        percentageUtilized: undefined,
      }
    } else {
      return undefined
    }
  }

  @computed
  get gpuProcessorInfo(): ProcessorInformation[] | [] {
    const gpus = this.store.machine.gpus

    return gpus.length > 0
      ? gpus.map((gpu) => {
          return {
            name: gpu.model,
            temperture: undefined,
            percentageUtilized: undefined,
          }
        })
      : []
  }

  @computed
  get minerWorkload(): MinerWorkload {
    const plugin = this.store.saladBowl.plugin
    return {
      name: plugin.name,
      version: plugin.version,
      algorithm: plugin.algorithm,
    }
  }

  constructor(private readonly store: RootStore) {}

  @action public setCPUandGPUMining = () => {
    this.store.saladBowl.setGpuOnly(true)
  }
}
