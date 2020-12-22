import { Accounts } from '../accounts'
import { PluginDefinition } from '../plugin-definitions'

export const createXMRigKawPowPluginDefinitions = (_accounts: Accounts): PluginDefinition[] => []
// TODO: Enable GPU mining on macOS
//// downloads
////   // XMRig support for KawPow added in v6.0.0.
////   .filter(({ version }) => {
////     const sv = semver.coerce(version)
////     return sv !== null && semver.gte(sv, '6.0.0')
////   })
////   .reduce((definitions, download) => {
////     const connection = (location: string) =>
////       `-o stratum+tcp://kawpow.${location}.nicehash.com:3385 -a kawpow -u ${accounts.nicehash.address}.${accounts.nicehash.rigId} -k --nicehash`
////
////     if (download.macOSUrl !== undefined) {
////       definitions.push({
////         name: 'XMRig',
////         version: download.version,
////         algorithm: 'KawPow',
////         downloadUrl: download.macOSUrl,
////         exe: 'xmrig',
////         args: `--no-cpu --cuda --opencl --donate-level=1 ${connection('usa')} ${connection('eu')}`,
////         runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
////         initialTimeout: 600000,
////         initialRetries: 3,
////         watchdogTimeout: 900000,
////         errors: [...STANDARD_ERRORS],
////         requirements: [hasGpu('*', 3072)],
////       })
////     }
////
////     return definitions
////   }, [] as PluginDefinition[])
