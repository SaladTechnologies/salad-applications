import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const claymoreRegion = (location: string) => `-epool stratum+tcp://daggerhashimoto.${location}.nicehash.com:3353`

export const getClaymoreEthashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'Claymore',
    version: '15',
    algorithm: 'Ethash',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `${claymoreRegion('usa')} ${claymoreRegion('eu')} -ewal ${nicehashAddress}.${
      machine.minerId
    } -eres 0 -esm 3 -allpools 1 -allcoins 0`,
    runningCheck: '(?:Share accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
