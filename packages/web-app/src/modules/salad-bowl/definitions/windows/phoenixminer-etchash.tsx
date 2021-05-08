import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../phoenix-miner'
import { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'

export const createPhoenixMinerEtchashPluginDefinitions = (accounts: Accounts): PluginDefinition[] => {
  const pool = `-pool ssl://us1-etc.ethermine.org:5555 -pool2 ssl://eu1-etc.ethermine.org:5555 -ewal ${accounts.ethermine.address}.${accounts.ethermine.workerId}`
  return downloads.reduce<PluginDefinition[]>((definitions, download) => {
    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'PhoenixMiner',
        version: download.version,
        algorithm: 'Etchash',
        downloadUrl: download.windowsUrl,
        exe: 'PhoenixMiner.exe',
        args: `-rmode 0 -rvram 1 -log 0 ${pool} -coin etc`,
        runningCheck: '(?:Share accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('*', 3072)],
      })
    }

    return definitions
  }, [])
}
