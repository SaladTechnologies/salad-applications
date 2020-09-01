import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const getServer = (location: string): string => `-o stratum+tcp://kawpow.${location}.nicehash.com:3385`

const getUser = (wallet: string, rigId: string): string => `-u ${wallet}.${rigId} -p x`

export const getTrexRavencoinNiceHashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'T-Rex',
    version: '0.16.1',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/trex0.16.1/t-rex-0-16-1-windows-cuda.zip',
    exe: 't-rex.exe',
    args: `-a kawpow ${getServer('usa')} ${getUser(
      nicehashAddress,
      machine.minerId,
    )} --exit-on-connection-lost --exit-on-cuda-error`,
    runningCheck: '(?:\\[ OK \\]|[1-9][0-9]*\\.\\d* (?:h|H|kh|kH|Kh|KH|mh|mH|Mh|MH))',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
