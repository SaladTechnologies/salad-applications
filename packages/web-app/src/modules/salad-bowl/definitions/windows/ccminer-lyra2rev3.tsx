import type { Accounts } from '../accounts'
import { downloads } from '../ccminer'
import { STANDARD_ERRORS } from '../errors'
import type { PluginDefinition } from '../plugin-definitions'
import { hasGpu, negateGpuRequirement } from '../requirements'

export const createCCminerLyra2REv3PluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) => `-o stratum+tcp://lyra2rev3.${location}.nicehash.com:3373`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'CCminer',
        version: download.version,
        algorithm: 'Lyra2REv3',
        downloadUrl: download.windowsUrl,
        exe: 'ccminer-x64.exe',
        args: `-a lyra2v3 ${connection('usa')} ${connection('eu')} -u ${accounts.nicehash.address}.${
          accounts.nicehash.rigId
        }`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [negateGpuRequirement('*', 4096), hasGpu('*', 2048)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
