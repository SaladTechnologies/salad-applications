import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { BEAM_WALLET_ADDRESS, STANDARD_ERRORS } from './constants'

const beamUser = (location: string, minerId: string) =>
  `-s ${location}-beam.flypool.org -n 3443 -u ${BEAM_WALLET_ADDRESS}.${minerId} --ssl 1`

export const getGminerBeamBitflyDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner-1.93-Flypool-Beam',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.93/gminer-1-93-windows.zip',
    exe: 'miner.exe',
    args: `-a beamhashII ${beamUser('us1', machine.minerId)} ${beamUser('eu1', machine.minerId)} -w 0`,
    runningCheck: 'Share Accepted',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
