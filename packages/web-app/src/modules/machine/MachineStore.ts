import { action, observable, computed } from 'mobx'
import { Machine } from './models/Machine'
import { RootStore } from '../../Store'
import { PluginDefinition } from '../salad-bowl/models'
import { ErrorCategory } from '../salad-bowl/models/ErrorCategory'
import { ErrorAction } from '../salad-bowl/models/ErrorAction'

export class MachineStore {
  @observable
  public currentMachine?: Machine

  @computed
  get currentEarningRate(): number | undefined {
    if (this.store.native.machineInfo && this.currentMachine && this.currentMachine.earningRate) {
      return this.currentMachine.earningRate
    } else {
      return undefined
    }
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

  pluginDefinition = (): PluginDefinition | undefined => {
    if (this.store.native.machineInfo === undefined) {
      return undefined
    }

    let cuda = this.store.native.machineInfo.graphics.controllers.some(x =>
      x.vendor.toLocaleLowerCase().includes('nvidia'),
    )

    let platform = cuda ? '-U' : '-G'

    //TODO: If statement based on the machine's GPUs
    let def = {
      name: 'Ethminer',
      downloadUrl:
        'https://github.com/ethereum-mining/ethminer/releases/download/v0.18.0/ethminer-0.18.0-cuda10.0-windows-amd64.zip',
      exe: 'bin/ethminer.exe',
      args: `--farm-recheck 1000 ${platform} -P stratum2+tcp://368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J.${this.minerId}@daggerhashimoto.usa.nicehash.com:3353`,
      runningCheck: '^m.* [KMG]h - ',
      errors: [
        // Anti-Virus
        {
          message: 'is not recognized as an internal or external command',
          errorCode: 100000000,
          errorCategory: ErrorCategory.AntiVirus,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'The system cannot find the path specified',
          errorCode: 100000002,
          errorCategory: ErrorCategory.AntiVirus,
          errorAction: ErrorAction.Restart,
        },
        // CUDA
        {
          message: '3221225595',
          errorCode: 100000003,
          errorCategory: ErrorCategory.Driver,
          errorAction: ErrorAction.Ignore,
        },
        {
          message: '3221225781',
          errorCode: 100000004,
          errorCategory: ErrorCategory.Driver,
          errorAction: ErrorAction.Ignore,
        },
        {
          message: 'CUDA error: Insufficient CUDA driver:',
          errorCode: 100000005,
          errorCategory: ErrorCategory.Driver,
          errorAction: ErrorAction.Ignore,
        },
        {
          message: 'CUDA error in func',
          errorCode: 100000006,
          errorCategory: ErrorCategory.Driver,
          errorAction: ErrorAction.Ignore,
        },
        {
          message: 'No OpenCL platforms found',
          errorCode: 100000007,
          errorCategory: ErrorCategory.Driver,
          errorAction: ErrorAction.Ignore,
        },
        // Unknown
        {
          message: 'exit: 0',
          errorCode: 9999,
          errorCategory: ErrorCategory.Unknown,
          errorAction: ErrorAction.Ignore,
        },
        // Nonce
        {
          message: 'Invalid nonce',
          errorCode: 9998,
          errorCategory: ErrorCategory.Unknown,
          errorAction: ErrorAction.Restart,
        },
        // Ignore
        {
          message: 'exit: 1',
          errorCode: 8888,
          errorCategory: ErrorCategory.Silent,
          errorAction: ErrorAction.Ignore,
        },
        // Network Errors
        {
          message: 'Network Error',
          errorCode: 4000,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'stratum  Error',
          errorCode: 4001,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'stratum Error',
          errorCode: 4001,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'Socket read failed',
          errorCode: 4002,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'Socket write failed',
          errorCode: 4003,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
        {
          message: 'No connection',
          errorCode: 4004,
          errorCategory: ErrorCategory.Network,
          errorAction: ErrorAction.Restart,
        },
      ],
    }

    console.log(JSON.stringify(def))

    return def
  }
}
