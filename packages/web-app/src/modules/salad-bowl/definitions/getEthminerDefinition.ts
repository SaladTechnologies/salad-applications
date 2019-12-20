import { Machine } from '../../machine/models/Machine'
import { MachineInfo } from '../../machine/models/MachineInfo'
import { ErrorAction } from '../models/ErrorAction'
import { ErrorCategory } from '../models/ErrorCategory'
import { PluginDefinition } from '../models/PluginDefinition'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

export const getEthminerDefinition = (machine: Machine, machineInfo: MachineInfo): PluginDefinition => {
  let cuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))

  let platform = cuda ? '-U' : '-G'

  let def = {
    name: 'Ethminer',
    downloadUrl:
      'https://github.com/ethereum-mining/ethminer/releases/download/v0.18.0/ethminer-0.18.0-cuda10.0-windows-amd64.zip',
    exe: 'bin/ethminer.exe',
    args: `--farm-recheck 1000 ${platform} -P stratum2+tcp://${MINING_ADDRESS}.${machine.minerId}@daggerhashimoto.usa.nicehash.com:3353`,
    runningCheck: '^m.* [KMG]h - ',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [
      ...STANDARD_ERRORS,
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
