import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

export const getPhoenixMinerEthashDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'PhoenixMiner',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/phoenixminer-4-9-c/phoenixminer-4-9-c-windows.zip',
    exe: 'PhoenixMiner.exe',
    args: `-pool stratum+tcp://daggerhashimoto.usa.nicehash.com:3353 -pool2 stratum+tcp://daggerhashimoto.eu.nicehash.com:3353 -ewal ${NICEHASH_MINING_ADDRESS}.${machine.minerId} -esm 3 -allpools 1 -allcoins 0`,
    runningCheck: '[1-9][0-9]*.\d* MH\/s',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
