import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

export const getMiniZZHashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'MiniZ',
    version: '1.6v3',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/miniz-1.6v3/miniz-1.6v3-cuda.zip',
    exe: 'miniZ.exe',
    args: `--url=tcp://${nicehashAddress}.${machine.minerId}@zhash.usa.nicehash.com:3387 --url=tcp://${nicehashAddress}.${machine.minerId}@zhash.eu.nicehash.com:3387 --par=144,5`,
    runningCheck: '\\*[1-9][0-9]*\\.\\d* I\\/s [1-9][0-9]*\\.\\d\\([1-9][0-9]*\\.\\d\\)Sol\\/s',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
