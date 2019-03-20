import { observable } from 'mobx'
import { Reward } from './Reward'

export abstract class FilterItem {
  @observable
  name: string = ''

  @observable
  checked: boolean = false

  constructor(name?: string, checked?: boolean) {
    this.name = name ? name : ''
    this.checked = checked ? checked : false
  }

  abstract checkReward(reward: Reward): boolean
}

export class NameFilter extends FilterItem {
  constructor(name?: string, checked?: boolean) {
    super(name, checked)
  }

  checkReward = (reward: Reward): boolean => this.name === reward.filter
}
