import { action, observable } from 'mobx'
import type { UseErrorBoundaryApi } from 'react-error-boundary'

export class ErrorBoundaryStore {
  @observable
  private pendingShowErrorBoundaryActions: (() => void)[] = []

  @observable
  public errorBoundary?: UseErrorBoundaryApi<Error> = undefined

  @action
  public setErrorBoundary = (errorBoundary: UseErrorBoundaryApi<Error>) => {
    this.errorBoundary = errorBoundary
    // Trigger any queued showErrorBoundary actions
    this.pendingShowErrorBoundaryActions.forEach((queuedAction) => {
      queuedAction()
    })
    this.pendingShowErrorBoundaryActions = []
  }

  @action
  public showErrorBoundary = (errorCaughtMessage: Error) => {
    if (this.errorBoundary) {
      this.errorBoundary.showBoundary(errorCaughtMessage)
    } else {
      // Queue the showErrorBoundary action if errorBoundary is not defined
      this.pendingShowErrorBoundaryActions.push(() => this.showErrorBoundary(errorCaughtMessage))
    }
  }

  @action
  public resetErrorBoundary = () => {
    this.errorBoundary?.resetBoundary()
  }
}
