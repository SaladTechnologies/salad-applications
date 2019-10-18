import { PluginStatus } from './PluginStatus'
import { observable } from 'mobx'

export class PluginInfo {
  @observable
  public status: PluginStatus = PluginStatus.Unknown

  constructor(public name: string) {}
}
