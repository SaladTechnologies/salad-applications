import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../phoenix-miner'
import { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'

export const createPhoenixMinerEthashPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  [
    `-pool ssl://us1.ethermine.org:5555 -pool2 ssl://eu1.ethermine.org:5555 -ewal ${accounts.ethermine.address}.${accounts.ethermine.workerId}`,
    `-pool stratum+tcp://daggerhashimoto.usa.nicehash.com:3353 -pool2 stratum+tcp://daggerhashimoto.eu.nicehash.com:3353 -ewal ${accounts.nicehash.address}.${accounts.nicehash.rigId} -esm 3 -allpools 1 -allcoins 0`,
  ].reduce(
    (definitions, pool) =>
      downloads.reduce((definitions, download) => {
        if (download.linuxUrl !== undefined) {
          definitions.push({
            name: 'PhoenixMiner',
            version: download.version,
            algorithm: 'Ethash',
            downloadUrl: download.linuxUrl,
            exe: 'PhoenixMiner',
            args: `-rmode 0 -rvram 1 -log 0 ${pool}`,
            runningCheck: '(?:Share accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
            initialTimeout: 600000,
            initialRetries: 3,
            watchdogTimeout: 900000,
            errors: [...STANDARD_ERRORS],
            requirements: [hasGpu('*', 4096)],
          })
        }

        return definitions
      }, definitions),
    [] as PluginDefinition[],
  )
