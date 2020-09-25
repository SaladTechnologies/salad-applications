import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../gminer'
import { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'

export const createGMinerZHashPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) =>
      `-s zhash.${location}.nicehash.com -n 3369 -u ${accounts.nicehash.address}.${accounts.nicehash.rigId}`

    if (download.linuxUrl !== undefined) {
      definitions.push({
        name: 'GMiner',
        version: download.version,
        algorithm: 'ZHash',
        downloadUrl: download.linuxUrl,
        exe: 'miner',
        args: `-a 144_5 ${connection('usa')} ${connection('eu')} -w 0 --pers auto`,
        runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* Sol\\/s)',
        initialTimeout: 600000,
        initialRetries: 1,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('*', 2048)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
