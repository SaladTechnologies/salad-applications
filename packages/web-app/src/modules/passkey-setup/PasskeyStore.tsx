import { action, observable, runInAction } from 'mobx'
import { getIsPasskeySupported } from './utils'

export class PasskeyStore {
  @observable
  public isPasskeySupported: boolean = false

  constructor() {
    this.setIsPasskeySupported()
  }

  @action
  private async setIsPasskeySupported(): Promise<void> {
    try {
      const isSupported = await getIsPasskeySupported()
      runInAction(() => {
        this.isPasskeySupported = isSupported
      })
    } catch (error) {
      console.error('Error checking passkey support:', error)
      runInAction(() => {
        this.isPasskeySupported = false
      })
    }
  }
}
