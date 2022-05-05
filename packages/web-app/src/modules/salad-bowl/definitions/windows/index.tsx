import type { Accounts } from '../accounts'
import type { PluginDefinition } from '../plugin-definitions'
import { createGMinerBeamHashPluginDefinitions } from './gminer-beamhash'
import { createGMinerCuckooCyclePluginDefinitions } from './gminer-cuckoocycle'
import { createGMinerZHashPluginDefinitions } from './gminer-zhash'
import { createPhoenixMinerEtchashPluginDefinitions } from './phoenixminer-etchash'
import { createPhoenixMinerEthashPluginDefinitions } from './phoenixminer-ethash'
import { createXMRigKawPowPluginDefinitions } from './xmrig-kawpow'
import { createXMRigRandomXPluginDefinitions } from './xmrig-randomx'

export const createWindowsPluginDefinitions = (accounts: Accounts): PluginDefinition[] => [
  ...createPhoenixMinerEthashPluginDefinitions(accounts),
  ...createXMRigKawPowPluginDefinitions(accounts),
  ...createPhoenixMinerEtchashPluginDefinitions(accounts),
  // TODO: ...createTRexKawPowPluginDefinitions(accounts),
  ...createGMinerBeamHashPluginDefinitions(accounts),
  ...createGMinerCuckooCyclePluginDefinitions(accounts),
  ...createGMinerZHashPluginDefinitions(accounts),
  ...createXMRigRandomXPluginDefinitions(accounts),
]
