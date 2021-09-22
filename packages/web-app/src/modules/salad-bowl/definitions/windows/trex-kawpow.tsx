import type { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import type { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'
import { downloads } from '../trex'

export const createTRexKawPowPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) => `-o stratum+tcp://kawpow.${location}.nicehash.com:3385`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'T-Rex',
        version: download.version,
        algorithm: 'KawPow',
        downloadUrl: download.windowsUrl,
        exe: 't-rex.exe',
        args: `-a kawpow ${connection('usa')} -u ${accounts.nicehash.address}.${
          accounts.nicehash.rigId
        } -p x --exit-on-connection-lost --exit-on-cuda-error`,
        runningCheck: '(?:\\[ OK \\]|[1-9][0-9]*\\.\\d* (?:h|H|kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
        initialTimeout: 600000,
        initialRetries: 1,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('cuda', 3072)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
