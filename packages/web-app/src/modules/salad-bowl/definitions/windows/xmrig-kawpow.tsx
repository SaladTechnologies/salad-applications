import type { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import type { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'
import { downloads } from '../xmrig'

export const createXMRigKawPowPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const connection = (location: string) =>
      `-o stratum+tcp://kawpow.${location}.nicehash.com:3385 -a kawpow -u ${accounts.nicehash.address}.${accounts.nicehash.rigId} -k --nicehash`

    if (download.windowsUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'KawPow',
        downloadUrl: download.windowsUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('*', 3072)],
      })
    }

    if (download.windowsCudaUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'KawPow',
        downloadUrl: download.windowsCudaUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('cuda', 3072)],
      })
    }

    if (download.windowsOpenCLUrl !== undefined) {
      definitions.push({
        name: 'XMRig',
        version: download.version,
        algorithm: 'KawPow',
        downloadUrl: download.windowsOpenCLUrl,
        exe: 'xmrig.exe',
        args: `--no-cpu --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
        runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
        initialTimeout: 600000,
        initialRetries: 3,
        watchdogTimeout: 900000,
        errors: [...STANDARD_ERRORS],
        requirements: [hasGpu('opencl', 3072)],
      })
    }

    return definitions
  }, [] as PluginDefinition[])
