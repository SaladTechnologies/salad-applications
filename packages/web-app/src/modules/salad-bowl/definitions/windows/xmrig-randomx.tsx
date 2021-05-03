import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { PluginDefinition } from '../plugin-definitions'
import { hasCpu, hasGpu, negateGpuRequirement } from '../requirements'
import { downloads } from '../xmrig'

export const createXMRigRandomXPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) =>
      `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 --coin=monero -u ${accounts.nicehash.address}.${accounts.nicehash.rigId} -k --nicehash`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.windowsUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [negateGpuRequirement('*', 4096), hasGpu('*', 2048)],
      })

      definitions.push({
        name: 'XMRig-CPU',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.windowsUrl,
        exe: 'xmrig.exe',
        args: `--donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasCpu(3072)],
      })
    }

    if (download.windowsCudaUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.windowsCudaUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [negateGpuRequirement('*', 4096), hasGpu('cuda', 2048)],
      })
    }

    if (download.windowsOpenCLUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.windowsOpenCLUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [negateGpuRequirement('*', 4096), hasGpu('opencl', 2048)],
      })

      definitions.push({
        name: 'XMRig-CPU',
        version: download.version,
        algorithm: 'RandomX',
        downloadUrl: download.windowsOpenCLUrl,
        exe: 'xmrig.exe',
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
