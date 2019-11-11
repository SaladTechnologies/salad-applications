import * as path from 'path'
import { PluginDefinition } from './models/PluginDefinition'
import { PluginStatus } from './models/PluginStatus'
import { Plugin } from './Plugin'
import { INotificationService } from './INotificationService'

export class PluginManager {
  private plugin?: Plugin
  private readonly pluginDirectory: string

  constructor(appPath: string, private readonly notificationService: INotificationService) {
    this.pluginDirectory = path.join(appPath, 'plugin-bin')
  }

  start = async (pluginDefiniton: PluginDefinition) => {
    if (this.plugin && this.plugin.status != PluginStatus.Stopped) {
      console.log(`The ${this.plugin.name} plugin is already running. Stopping it before starting a new one`)
      await this.plugin.stop()
    }

    this.plugin = new Plugin(this.pluginDirectory, pluginDefiniton, this.notificationService)
    console.log(`Starting a new ${this.plugin.name} plugin`)

    await this.plugin.start()
  }

  stop = async () => {
    if (!this.plugin) {
      console.warn('No plugin to stop. Skipping')
      return
    }

    console.log(`Stopping ${this.plugin.name}`)

    await this.plugin.stop()
  }
}
