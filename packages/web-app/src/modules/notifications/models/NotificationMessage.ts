export interface NotificationMessage {
  /** The notification id. Use for closing notification.*/
  id?: number

  /** The title */
  title: string

  /** The message body */
  message: string

  /**
   * Set the delay in ms to close the toast automatically.
   * Use `false` to prevent the toast from closing.
   * `Default: 5000`
   */
  autoClose?: number | false

  /**
   * Should the notification also be sent as a desktop notification
   * `Default: false`
   */
  showDesktop?: boolean

  /**
   * The notification type
   * `Default: normal`
   */
  type?: 'normal' | 'error'

  /**
   * Callback when the notification is clicked on in the salad app
   * `Default: close the notification`
   */
  onClick?: () => void
}
