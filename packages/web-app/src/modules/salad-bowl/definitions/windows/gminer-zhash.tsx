import type { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../gminer'
import type { PluginDefinition } from '../plugin-definitions'
import { hasGpu, isEnabled } from '../requirements'

export const createGMinerZHashPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const nhConnection = (location: string) =>
      `-s zhash.${location}.nicehash.com -n 3369 -u ${accounts.nicehash.address}.${accounts.nicehash.rigId}`
    const phConnection = (location: string) =>
      `-s ${location}prohashing.com -n 3345 -u ${accounts.prohashing.username} -p o=${accounts.prohashing.workerName},n=${accounts.prohashing.workerName}`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'GMiner',
        version: download.version,
        algorithm: 'ZHash',
        downloadUrl: download.windowsUrl,
        exe: 'miner.exe',
        args: `-a 144_5 ${phConnection('')} ${phConnection('eu.')} -w 0 --pers auto`,
        runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* Sol\\/s)',
        initialTimeout: 600000,
        initialRetries: 1,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [isEnabled('app_prohashing'), hasGpu('*', 2048)],
      })

      definitions.push({
        name: 'GMiner',
        version: download.version,
        algorithm: 'ZHash',
        downloadUrl: download.windowsUrl,
        exe: 'miner.exe',
        args: `-a 144_5 ${nhConnection('usa')} ${nhConnection('eu')} -w 0 --pers auto`,
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
