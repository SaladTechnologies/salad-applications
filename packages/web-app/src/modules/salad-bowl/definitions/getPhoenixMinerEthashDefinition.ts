import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

export const getPhoenixMinerEthashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'PhoenixMiner',
    version: '5.1c',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/phoenixminer-5-1-c/phoenixminer-5-1-c-windows.zip',
    exe: 'PhoenixMiner.exe',
    args: `-rvram 1 -pool stratum+tcp://daggerhashimoto.usa.nicehash.com:3353 -pool2 stratum+tcp://daggerhashimoto.eu.nicehash.com:3353 -ewal ${nicehashAddress}.${machine.minerId} -esm 3 -allpools 1 -allcoins 0`,
    runningCheck: '(?:Share accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
