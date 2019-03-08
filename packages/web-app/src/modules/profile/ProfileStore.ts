import { action, observable } from 'mobx'
import { Profile } from './models'

export class ProfileStore {
  @observable
  public profile?: Profile

  @observable
  public isAccountModalVisible: boolean = false

  @action
  showAccountModal = () => {
    this.isAccountModalVisible = true
  }

  @action
  hideAccountModal = () => {
    this.isAccountModalVisible = false
  }
}
