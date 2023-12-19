import { action, observable } from 'mobx'
import type { UseErrorBoundaryApi } from 'react-error-boundary'

export class ErrorBoundaryStore {
  @observable
  private showErrorQueue: (() => void)[] = []

  @observable
  public errorBoundary?: UseErrorBoundaryApi<Error> = undefined

  @action
  public setErrorBoundary = (errorBoundary: UseErrorBoundaryApi<Error>) => {
    this.errorBoundary = errorBoundary
    // Trigger any queued showError actions
    this.showErrorQueue.forEach((queuedAction) => {
      queuedAction()
    })
    this.showErrorQueue = []
  }

  @action
  public showErrorBoundary = (errorCaughtMessage: Error) => {
    if (this.errorBoundary) {
      this.errorBoundary.showBoundary(errorCaughtMessage)
    } else {
      // Queue the showError action if errorBoundary is not defined
      this.showErrorQueue.push(() => this.showErrorBoundary(errorCaughtMessage))
    }
  }

  @action
  public resetErrorBoundary = () => {
    this.errorBoundary?.resetBoundary()
  }
}
