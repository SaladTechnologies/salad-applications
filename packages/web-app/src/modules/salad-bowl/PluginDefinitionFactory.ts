import { Machine } from '../machine/models/Machine'
import { PluginDefinition } from './models'
import { ErrorCategory } from './models/ErrorCategory'
import { ErrorAction } from './models/ErrorAction'
import { RootStore } from '../../Store'
import { MachineInfo } from '../machine/models'

const miningAddress = '368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J'

export const getPluginDefinition = (store: RootStore): PluginDefinition | undefined => {
  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo

  if (machineInfo === undefined || machine === undefined || store.native.gpuNames === undefined) {
    return undefined
  }

  // if (store.native.gpuNames.some(x => x.includes('1050'))) {
  return beamV2Definition(machine)
  // } else {
  // return ethminerDefinition(machine, machineInfo)
  // }
}

export const beamV2Definition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'BeamV2',
    downloadUrl: 'https://github.com/develsoftware/GMinerRelease/releases/download/1.70/gminer_1_70_windows64.zip',
    exe: 'miner.exe',
    args: `-a beamhashII -s beamv2.usa.nicehash.com -n 3378 -u ${miningAddress}.${machine.minerId} -w 0`,
    runningCheck: 'Share Accepted',
    errors: [...standardErrors],
  }

  return def
}

export const ethminerDefinition = (machine: Machine, machineInfo: MachineInfo): PluginDefinition | undefined => {
  let cuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))

  let platform = cuda ? '-U' : '-G'

  let def = {
    name: 'Ethminer',
    downloadUrl:
      'https://github.com/ethereum-mining/ethminer/releases/download/v0.18.0/ethminer-0.18.0-cuda10.0-windows-amd64.zip',
    exe: 'bin/ethminer.exe',
    args: `--farm-recheck 1000 ${platform} -P stratum2+tcp://${miningAddress}.${machine.minerId}@daggerhashimoto.usa.nicehash.com:3353`,
    runningCheck: '^m.* [KMG]h - ',
    errors: [
      ...standardErrors,
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
        errorAction: ErrorAction.Ignore,
      },
      {
        message: 'stratum  Error',
        errorCode: 4001,
        errorCategory: ErrorCategory.Network,
        errorAction: ErrorAction.Ignore,
      },
      {
        message: 'stratum Error',
        errorCode: 4001,
        errorCategory: ErrorCategory.Network,
        errorAction: ErrorAction.Ignore,
      },
      {
        message: 'Socket read failed',
        errorCode: 4002,
        errorCategory: ErrorCategory.Network,
        errorAction: ErrorAction.Ignore,
      },
      {
        message: 'Socket write failed',
        errorCode: 4003,
        errorCategory: ErrorCategory.Network,
        errorAction: ErrorAction.Ignore,
      },
      {
        message: 'No connection',
        errorCode: 4004,
        errorCategory: ErrorCategory.Network,
        errorAction: ErrorAction.Ignore,
      },
    ],
  }

  console.log(JSON.stringify(def))

  return def
}

const standardErrors = [
  // Anti-Virus
  {
    message: 'is not recognized as an internal or external command',
    errorCode: 100000000,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Stop,
  },
  {
    message: 'The system cannot find the path specified',
    errorCode: 100000002,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Stop,
  },
]
