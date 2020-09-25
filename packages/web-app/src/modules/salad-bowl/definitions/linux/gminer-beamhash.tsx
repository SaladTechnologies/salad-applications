import semver from 'semver'
import { Accounts } from '../accounts'
import { STANDARD_ERRORS } from '../errors'
import { downloads } from '../gminer'
import { PluginDefinition } from '../plugin-definitions'
import { hasGpu } from '../requirements'

const nicehashServer = (accounts: Accounts, location: string): string =>
  `-s beamv3.${location}.nicehash.com -n 3387 -u ${accounts.nicehash.address}.${accounts.nicehash.rigId}`

const ethermineServer = (accounts: Accounts, location: string): string =>
  `-s ${location}-beam.flypool.org -n 3443 -u ${accounts.flypoolBeam.address}.${accounts.flypoolBeam.workerId} --ssl 1`

export const createGMinerBeamHashPluginDefinitions = (accounts: Accounts): PluginDefinition[] =>
  [
    `${nicehashServer(accounts, 'usa')} ${nicehashServer(accounts, 'eu')}`,
    `${ethermineServer(accounts, 'us1')} ${ethermineServer(accounts, 'eu1')}`,
  ].reduce(
    (definitions, pool) =>
      downloads
        // GMiner support for BeamHashIII added in v2.11.
        .filter(({ version }) => {
          const sv = semver.coerce(version)
          return sv !== null && semver.gte(sv, '2.11.0')
        })
        .reduce((definitions, download) => {
          if (download.linuxUrl !== undefined) {
            definitions.push({
              name: 'GMiner',
              version: download.version,
              algorithm: 'BeamHashIII',
              downloadUrl: download.linuxUrl,
              exe: 'miner',
              args: `-a beamhashIII ${pool} -w 0`,
              runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* Sol\\/s)',
              initialTimeout: 600000,
              initialRetries: 1,
              watchdogTimeout: 900000,
              errors: [...STANDARD_ERRORS],
              requirements: [hasGpu('*', 4096)],
            })
          }

          return definitions
        }, definitions),
    [] as PluginDefinition[],
  )
