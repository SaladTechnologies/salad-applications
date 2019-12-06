import { observable } from 'mobx'
import { Reward } from './Reward'

export abstract class FilterItem {
  @observable
  name: string = ''

  @observable
  checked: boolean = false

  constructor(name: string, checked?: boolean) {
    this.name = name ? name : ''
    this.checked = checked ? checked : false
  }

  abstract checkReward(reward: Reward): boolean
}

export class TagFilter extends FilterItem {
  checkReward = (reward: Reward): boolean => {
    return reward && reward.tags && reward.tags.some(x => x === this.name)
  }
}
