import type { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import type { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'
import { downloads } from '../xmrig'

export const createXMRigKawPowPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  downloads.reduce((definitions, download) => {
    const nhConnection = (location: string) =>
      `-o stratum+tcp://kawpow.${location}.nicehash.com:3385 -a kawpow -u ${accounts.nicehash.address}.${accounts.nicehash.rigId} -k --nicehash`
    // const phConnection = (location: string) =>
    //   `-o stratum+tcp://${location}prohashing.com:3361 -a kawpow -u ${accounts.prohashing.username} -p o=${accounts.prohashing.workerName},n=${accounts.prohashing.workerName} -k`

    // definitions.push({
    //   name: 'XMRig',
    //   version: download.version,
    //   algorithm: 'KawPow',
    //   downloadUrl: download.windowsUrl,
    //   exe: 'xmrig.exe',
    //   args: `--no-cpu --cuda --opencl --donate-level=1 ${phConnection('')} ${phConnection('eu.')}`,
    //   runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
    //   initialTimeout: 600000,
    //   initialRetries: 3,
    //   watchdogTimeout: 900000,
    //   errors: [...STANDARD_ERRORS],
    //   requirements: [hasGpu('*', 3072)],
    // })

    definitions.push({
      name: 'XMRig',
      version: download.version,
      algorithm: 'KawPow',
      downloadUrl: download.windowsUrl,
      exe: 'xmrig.exe',
      args: `--no-cpu --cuda --opencl --donate-level=1 ${nhConnection('usa')} ${nhConnection('eu')}`,
      runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
      initialTimeout: 600000,
      initialRetries: 3,
      watchdogTimeout: 900000,
      errors: [...STANDARD_ERRORS],
      requirements: [hasGpu('*', 3072)],
    })

    return definitions
  }, [] as PluginDefinition[])
