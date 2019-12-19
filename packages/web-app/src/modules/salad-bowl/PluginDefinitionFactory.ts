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

  let supportsCuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))
  if (supportsCuda) {
    return xmrigDefinitionCuda(machine)
  } else {
    return xmrigDefinitionOpenCL(machine)
  }
}

export const beamV2Definition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'BeamV2-1.83',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-a beamhashII ${beamUser('usa', machine.minerId)} ${beamUser('eu', machine.minerId)} ${beamUser(
      'hk',
      machine.minerId,
    )} ${beamUser('jp', machine.minerId)} ${beamUser('in', machine.minerId)} ${beamUser('br', machine.minerId)}`,
    runningCheck: 'Share Accepted',
    errors: [...standardErrors],
  }

  return def
}

const beamUser = (location: string, minerId: string) =>
  `-s beamv2.${location}.nicehash.com -n 3378 -u ${miningAddress}.${minerId}`

export const claymoreDefinition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'Claymore-15',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `-esm 3 -ewal ${miningAddress}.${machine.minerId} -epool daggerhashimoto.usa.nicehash.com:3353 -allpools 1 -allcoins 0`,
    runningCheck: 'ETH: GPU0 [1-9]+(\.[0-9][0-9][0-9]?)? [KMG]h/s',
    errors: [...standardErrors]
  }

  return def
}

const xmrigRegion = (location: string, minerId: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 -u ${miningAddress}.${minerId} -k --nicehash --coin monero`

export const xmrigDefinitionCuda = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'XMRig-5.2.0-CUDA',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-cuda.zip',
    exe: 'xmrig.exe',
    args: `--donate-level 1 --no-cpu --opencl --cuda ${xmrigRegion('usa', machine.minerId)} ${xmrigRegion('eu', machine.minerId)} ${xmrigRegion('hk', machine.minerId)} ${xmrigRegion('jp', machine.minerId)} ${xmrigRegion('in', machine.minerId)} ${xmrigRegion('br', machine.minerId)}`,
    runningCheck: 'accepted',
    errors: [...standardErrors]
  }

  return def
}

export const xmrigDefinitionOpenCL = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'XMRig-5.2.0-OpenCL',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-opencl.zip',
    exe: 'xmrig.exe',
    args: `--donate-level 1 --no-cpu --opencl ${xmrigRegion('usa', machine.minerId)} ${xmrigRegion('eu', machine.minerId)} ${xmrigRegion('hk', machine.minerId)} ${xmrigRegion('jp', machine.minerId)} ${xmrigRegion('in', machine.minerId)} ${xmrigRegion('br', machine.minerId)}`,
    runningCheck: 'accepted',
    errors: [...standardErrors]
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
