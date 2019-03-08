import { observable } from 'mobx'
import { Profile } from './models'

export class ProfileStore {
  @observable
  public profile?: Profile
}
