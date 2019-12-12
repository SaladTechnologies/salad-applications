import * as path from 'path'
import { PluginDefinition } from './models/PluginDefinition'
import { PluginStatus } from './models/PluginStatus'
import { Plugin } from './Plugin'
import { INotificationService } from './INotificationService'
import { ErrorCategory } from './models/ErrorCategory'

export class PluginManager {
  private plugin?: Plugin
  private readonly pluginDirectory: string

  constructor(appPath: string, private readonly notificationService: INotificationService) {
    this.pluginDirectory = path.join(appPath, 'plugin-bin')
  }

  start = async (pluginDefinitions: Array<PluginDefinition>, pluginIndex: number) => {
    let pluginDefinition = pluginDefinitions[pluginIndex]
    if (this.plugin && this.plugin.status != PluginStatus.Stopped) {
      console.log(`The ${this.plugin.name} plugin is already running. Stopping it before starting a new one`)
      await this.plugin.stop()
    }

    this.plugin = new Plugin(this.pluginDirectory, pluginDefinition, this.notificationService, async () => {
      console.log('plugin closed, trying to start next miner')
      if (pluginIndex === pluginDefinitions.length - 1) {
        console.log('there are no more plugins to try')
        this.notificationService.sendError({
          message: 'There are no compatible plugins for this machine to use.',
          errorCode: 8008135,
          errorCategory: ErrorCategory.Incompatible
        })
      } else {
        let nextPluginIndex = pluginIndex + 1

        await this.start(pluginDefinitions, nextPluginIndex)
      }
    })
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
