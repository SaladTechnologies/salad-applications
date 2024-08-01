import { action, observable, runInAction } from 'mobx'
import { getIsDeviceSupportPasskey } from './utils'

export class PasskeyStore {
  @observable
  public isDeviceSupportPasskey: boolean = false

  constructor() {
    this.checkIsDeviceSupportPasskey()
  }

  @action
  private async checkIsDeviceSupportPasskey(): Promise<void> {
    try {
      const isSupported = await getIsDeviceSupportPasskey()
      runInAction(() => {
        this.isDeviceSupportPasskey = isSupported
      })
    } catch (error) {
      console.error('Error checking passkey support:', error)
      runInAction(() => {
        this.isDeviceSupportPasskey = false
      })
    }
  }
}
