import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { PluginDefinition } from '../plugin-definitions'
import { hasCpu, hasGpu, not } from '../requirements'
import { downloads } from '../xmrig'

export const createXMRigRandomXPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) =>
      `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 --coin=monero -u ${accounts.nicehash.address}.${accounts.nicehash.rigId} -k --nicehash`

    if (download.macOSUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.macOSUrl,
        exe: 'xmrig',
        args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [not(hasGpu('*', 4096)), hasGpu('*', 2048)],
      })

      definitions.push({
        name: 'XMRig-CPU',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.macOSUrl,
        exe: 'xmrig',
        args: `--donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasCpu(3072)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
