export enum NotificationMessageCategory {
  AppUpdate = 'App Update',
  AutoStart = 'Auto Start',
  Error = 'Error',
  FurtherActionRequired = 'Further Action Required',
  Incentive = 'Incentive',
  MachineIncompatible = 'Machine Incompatible',
  Redemption = 'Redemption',
  Success = 'Success',
  BonusClaimedSuccess = 'Bonus Claimed Success',
  BonusClaimedError = 'Bonus Claimed Error',
  ReferralCodeInvalid = 'Referral Code Invalid',
  ReferralCodeDoesNotExist = 'Referral Code Does Not Exist',
  ReferralCodeError = 'Referral Code Error',
  NovuInfo = 'Novu Info',
  NovuWarning = 'Novu Warning',
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

/** A resource that represents an action that acknowledges a notification. */
export interface AcknowledgeNotificationAction {
  /** The title. */
  title: string;
}
/** A resource that represents an action that dismisses a notification. */
export interface DismissNotificationAction {
  /** The title. */
  title: string;
}
/** A resource that represents an action that opens a link in the default browser. */
export interface OpenLinkNotificationAction {
  /** The title. */
  title: string;
  /** The link. */
  link: string;
}

/** A resource that represents an in-app notification action. */
export interface NovuNotificationAction {
  action?: {
      $case: "acknowledge";
      acknowledge: AcknowledgeNotificationAction;
  } | {
    $case: "dismiss";
    dismiss: DismissNotificationAction;
  } | {
      $case: "openLink";
      openLink: OpenLinkNotificationAction;
  }
}

export interface NovuNotification {
  /** The resource identifier. */
  id: string;
  /** The Novu resource identifier. */
  novuId: string;
  /** The title. */
  title: string;
  /** The body. */
  body: string;
  /** The date and time of the notification. */
  createTime: Date | undefined;
  /** The list of actions. */
  actions: NovuNotificationAction[];
  /** A value indicating whether the notification has been acknowledged. */
  acknowledged: boolean;
  /** identifier used to track actions from this notification. */
  trackId: string;
  /** A value indicating whether the notification is os type. */
  osNotification: boolean
  /** A value indicating whether the notification has been seen. */
  seen: boolean
  /** A value indicating whether the notification has been read. */
  read: boolean
}
