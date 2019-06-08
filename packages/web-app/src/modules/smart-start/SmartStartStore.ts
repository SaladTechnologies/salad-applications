import { action } from 'mobx'
// import { action, observable, runInAction, computed, flow } from 'mobx'
import { RootStore } from '../../Store'
import { Blacklist } from '../machine/models/Blacklist';
import { setBlacklist } from '../../Storage';

export class SmartStartStore {
  constructor(private readonly store: RootStore) {}

  @action
  updateBlacklist = (update: Blacklist) => {
    const _BLACKLIST = 'BLACKLIST'
    const blacklist = this.store.native.blacklist
    
    if (blacklist) {
      blacklist.map(item => {
        if (item.name === update.name) {
          item.enabled = update.enabled
          setBlacklist(_BLACKLIST, blacklist)
        }
      })
    }
  }
}
