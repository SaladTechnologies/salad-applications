import type { Accounts } from '../accounts'
import type { PluginDefinition } from '../plugin-definitions'
import { createXMRigKawPowPluginDefinitions } from './xmrig-kawpow'
import { createXMRigRandomXPluginDefinitions } from './xmrig-randomx'

export const createMacOSPluginDefinitions = (accounts: Accounts): PluginDefinition[] => [
  ...createXMRigKawPowPluginDefinitions(accounts),
  ...createXMRigRandomXPluginDefinitions(accounts),
]
