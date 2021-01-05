import type { Accounts } from './accounts'
import { createLinuxPluginDefinitions } from './linux'
import { createMacOSPluginDefinitions } from './macos'
import type { PluginDefinition } from './plugin-definitions'
import { createWindowsPluginDefinitions } from './windows'

export const getPluginDefinitions = (accounts: Accounts, platform: string): PluginDefinition[] => {
  let pluginDefinitions: PluginDefinition[]
  switch (platform) {
    case 'darwin':
      pluginDefinitions = createMacOSPluginDefinitions(accounts)
      break
    case 'linux':
      pluginDefinitions = createLinuxPluginDefinitions(accounts)
      break
    // The `electron` value is injected by older versions of the Windows desktop application.
    case 'electron':
    case 'win32':
      pluginDefinitions = createWindowsPluginDefinitions(accounts)
      break
    default:
      pluginDefinitions = []
      break
  }

  return pluginDefinitions
}
