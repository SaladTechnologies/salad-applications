import { observable } from 'mobx'

export class FilterItem {
  @observable
  name: string = ''

  @observable
  checked: boolean = false

  constructor(name?: string, checked?: boolean) {
    this.name = name ? name : ''
    this.checked = checked ? checked : false
  }
}
