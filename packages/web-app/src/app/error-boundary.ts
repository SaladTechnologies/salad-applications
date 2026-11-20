import type { UseErrorBoundaryApi } from 'react-error-boundary'

/**
 * Lets code outside React show or reset the app's error boundary. The app hands it the boundary once it renders; an
 * error shown before then is shown as soon as the boundary arrives.
 */
export class ErrorBoundaryBridge {
  /** The app's error boundary, once the app has rendered. */
  private boundary: UseErrorBoundaryApi<Error> | undefined = undefined

  /** The errors shown before the boundary arrived, in order. */
  private pending: Error[] = []

  /** Takes the app's error boundary, and shows the errors that were waiting for it. */
  public readonly setErrorBoundary = (boundary: UseErrorBoundaryApi<Error>): void => {
    this.boundary = boundary
    const { pending } = this
    this.pending = []
    for (const error of pending) {
      this.showErrorBoundary(error)
    }
  }

  /** Shows the error page for the error, now or as soon as the app's error boundary arrives. */
  public readonly showErrorBoundary = (error: Error): void => {
    if (this.boundary) {
      this.boundary.showBoundary(error)
    } else {
      this.pending.push(error)
    }
  }

  /** Clears the error page, if the app's error boundary has arrived. */
  public readonly resetErrorBoundary = (): void => {
    this.boundary?.resetBoundary()
  }
}
