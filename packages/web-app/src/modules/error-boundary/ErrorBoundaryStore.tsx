import { action, observable } from 'mobx'

export class ErrorBoundaryStore {
  @observable
  public isErrorCaught: boolean = false

  @observable
  public errorCaughtMessage?: string = undefined

  @action
  public setIsErrorCaught = (isErrorCaught: boolean) => {
    this.isErrorCaught = isErrorCaught
  }

  @action
  public setErrorCaughtMessage = (errorCaughtMessage: string) => {
    this.errorCaughtMessage = errorCaughtMessage
  }
}
