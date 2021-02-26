export enum NotificationMessageCategory {
  AppUpdate = 'App Update',
  AutoStart = 'Auto Start',
  Error = 'Error',
  FurtherActionRequired = 'Further Action Required',
  Incentive = 'Incentive',
  MachineIncompatible = 'Machine Incompatible',
  Redemption = 'Redemption',
  Success = 'Success',
}

export interface NotificationMessage {
  /** An identifying category for the type of toast shown for analytics tracking */
  category: NotificationMessageCategory

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
