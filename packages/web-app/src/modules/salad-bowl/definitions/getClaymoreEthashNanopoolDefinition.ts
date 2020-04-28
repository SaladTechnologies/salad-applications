import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS, ETH_WALLET_ADDRESS } from './constants'

const getPool = (subdomain: string): string =>
  `-epool ${subdomain}.nanopool.org:9999`

export const getClaymoreEthashNanopoolDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'Claymore',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `${getPool('eth-us-west1')} ${getPool('eth-us-east1')} ${getPool('eth-eu1')} ${getPool('eth-eu2')} -ewal ${ETH_WALLET_ADDRESS} -eres 0 -epsw x -eworker ${machine.id} -allpools 1 -allcoins 0`,
    runningCheck: '(?:Share accepted|[1-9][0-9]*.d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
