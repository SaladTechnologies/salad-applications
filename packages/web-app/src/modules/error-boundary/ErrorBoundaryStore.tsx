import { action, observable } from 'mobx'
import type { UseErrorBoundaryApi } from 'react-error-boundary'

export class ErrorBoundaryStore {
  @observable
  private showErrorBoundaryQueue: (() => void)[] = []

  @observable
  public errorBoundary?: UseErrorBoundaryApi<Error> = undefined

  @action
  public setErrorBoundary = (errorBoundary: UseErrorBoundaryApi<Error>) => {
    this.errorBoundary = errorBoundary
    // Trigger any queued showErrorBoundary actions
    this.showErrorBoundaryQueue.forEach((queuedAction) => {
      queuedAction()
    })
    this.showErrorBoundaryQueue = []
  }

  @action
  public showErrorBoundary = (errorCaughtMessage: Error) => {
    if (this.errorBoundary) {
      this.errorBoundary.showBoundary(errorCaughtMessage)
    } else {
      // Queue the showErrorBoundary action if errorBoundary is not defined
      this.showErrorBoundaryQueue.push(() => this.showErrorBoundary(errorCaughtMessage))
    }
  }

  @action
  public resetErrorBoundary = () => {
    this.errorBoundary?.resetBoundary()
  }
}
