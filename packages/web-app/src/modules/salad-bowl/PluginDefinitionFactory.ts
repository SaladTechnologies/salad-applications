import { Machine } from '../machine/models/Machine'
import { PluginDefinition } from './models'
import { ErrorCategory } from './models/ErrorCategory'
import { ErrorAction } from './models/ErrorAction'
import { RootStore } from '../../Store'
import { MachineInfo } from '../machine/models'
import { gminerEthDefinition } from './GMinerDefinitions'

export const miningAddress = '368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J'

export const nicehashUser = (machine: Machine) => `${miningAddress}.${machine.minerId}`

export const getPluginDefinitions = (store: RootStore): Array<PluginDefinition | undefined> => {
  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo

  if (machineInfo === undefined || machine === undefined || store.native.gpuNames === undefined) {
    return new Array()
  }

  let supportsCuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))
  if (supportsCuda) {
    let gpuFallbackList = new Array(beamV2Definition(machine), gminerEthDefinition(machine), claymoreDefinition(machine), xmrigDefinitionCuda(machine))
    return gpuFallbackList
  } else {
    let gpuFallbackList = new Array(beamV2Definition(machine), gminerEthDefinition(machine), claymoreDefinition(machine), xmrigDefinitionOpenCL(machine))
    return gpuFallbackList
  }
}

const beamUser = (location: string, minerId: string) =>
  `-s beamv2.${location}.nicehash.com -n 3378 -u ${miningAddress}.${minerId}`

export const beamV2Definition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'BeamV2-1.83',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-a -w 0 beamhashII ${beamUser('usa', machine.minerId)} ${beamUser('eu', machine.minerId)} ${beamUser(
      'hk',
      machine.minerId,
    )} ${beamUser('jp', machine.minerId)} ${beamUser('in', machine.minerId)} ${beamUser('br', machine.minerId)}`,
    runningCheck: 'Share Accepted',
    errors: [...standardErrors]
  }

  return def
}

const claymoreRegion = (location: string) =>
  `-epool daggerhashimoto.${location}.nicehash.com:3353`

export const claymoreDefinition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'Claymore-15',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `-esm 3 -ewal ${miningAddress}.${machine.minerId} ${claymoreRegion('usa')} ${claymoreRegion('eu')} ${claymoreRegion('hk')} ${claymoreRegion('jp')} ${claymoreRegion('in')} ${claymoreRegion('br')} -allpools 1 -allcoins 0`,
    runningCheck: 'ETH: GPU0 [1-9]+(\.[0-9][0-9][0-9]?)? [KMG]h/s',
    errors: [...standardErrors]
  }

  return def
}

const xmrigRegion = (location: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 -u ${miningAddress} -k --nicehash --coin monero`

export const xmrigDefinitionCuda = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'XMRig-5.2.0-CUDA',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-cuda.zip',
    exe: 'xmrig.exe',
    args: `--donate-level 1 --no-cpu --opencl --cuda ${xmrigRegion('usa')} ${xmrigRegion('eu')} ${xmrigRegion('hk')} ${xmrigRegion('jp')} ${xmrigRegion('in')} ${xmrigRegion('br')}`,
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
    args: `--donate-level 1 --no-cpu --opencl ${xmrigRegion('usa')} ${xmrigRegion('eu')} ${xmrigRegion('hk')} ${xmrigRegion('jp')} ${xmrigRegion('in')} ${xmrigRegion('br')}`,
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

export const standardErrors = [
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
