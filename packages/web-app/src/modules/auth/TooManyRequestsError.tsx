export class TooManyRequestsError extends Error {
  /**
   * Creates a new `TooManyRequestsError`.
   * @param retryAfter The number of seconds to wait before trying the request again.
   */
  constructor(message?: string, public readonly retryAfter?: number) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
