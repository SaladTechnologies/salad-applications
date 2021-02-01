import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../gminer'
import { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'

export const createGMinerCuckooCyclePluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) =>
      `-s cuckoocycle.${location}.nicehash.com -n 3376 -u ${accounts.nicehash.address}.${accounts.nicehash.rigId}`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'GMiner',
        version: download.version,
        algorithm: 'CuckooCycle',
        downloadUrl: download.windowsUrl,
        exe: 'miner.exe',
        args: `-a cuckoo ${connection('usa')} ${connection('eu')} -w 0`,
        runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* G\\/s)',
        initialTimeout: 600000,
        initialRetries: 1,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('*', 4608)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
