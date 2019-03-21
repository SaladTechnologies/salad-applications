import { observable, action } from 'mobx'

export class RewardDetails {
  id: string

  @observable
  isLoading: boolean = false

  @observable
  content?: ModalContent[]

  constructor(id: string) {
    this.id = id
  }

  @action
  setLoading = (value: boolean) => (this.isLoading = value)
}

export enum ContentType {
  'checkbox' = 0,
  'textInput' = 1,
  'emailInput' = 2,
  'dropdown' = 3,
  'plainText' = 4,
  'buttonUrl' = 5,
  'buttonAction' = 6,
  'doneButton' = 7,
}

export enum StyleType {
  'header' = 0,
  'title' = 1,
  'description' = 2,
  'smallInput' = 3,
  'mediumInput' = 4,
  'largeInput' = 5,
  'buttonOutlined' = 6,
  'buttonFilled' = 7,
}

export class ModalContent {
  @observable
  id?: string

  @observable
  label?: string

  @observable
  type?: ContentType

  @observable
  value?: any

  @observable
  required?: boolean

  @observable
  style?: StyleType

  public constructor(init?: Partial<ModalContent>) {
    Object.assign(this, init)
  }
}
