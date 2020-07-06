import { observable } from 'mobx'
import { PluginStatus } from './PluginStatus'

export class PluginInfo {
  @observable
  public name: string = 'Unknown'

  @observable
  public version: string = ''

  @observable
  public status: PluginStatus = PluginStatus.Unknown
}
