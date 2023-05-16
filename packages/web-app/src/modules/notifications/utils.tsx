import type { IMessage } from '@novu/shared'
import type { NotificationBannerProps } from '@saladtechnologies/garden-components'
import { DateTime } from 'luxon'
import { NotificationMessageCategory, type NovuNotification, type NovuNotificationAction } from './models'

interface NotificationCta {
  acknowledgeLabel: string
  linkCTA: {
    linkLabel: string
    url: string
  }
}

type NotificationCtaContent = NotificationCta['acknowledgeLabel'] | NotificationCta['linkCTA']

const getNormalizedNotificationAction = (ctaKey: string, ctaContent: NotificationCtaContent): NovuNotificationAction['action'] => {
  switch (ctaKey) {
    case 'linkCTA': {
      return {
        $case: 'openLink',
        openLink: {
          link: (ctaContent as NotificationCta['linkCTA']).url,
          title: (ctaContent as NotificationCta['linkCTA']).linkLabel,
        },
      }
    }
    case 'acknowledgeLabel':
    default: {
      return {
        $case: 'acknowledge',
        acknowledge: {
          title: ctaContent as NotificationCta['acknowledgeLabel'],
        },
      }
    }
  }
}

export interface IMessageWithId extends IMessage {
  id: string
}

export const getNormalizedNovuNotification = (novuNotification: IMessage): NovuNotification | null => {
  try {
    const { v1, osNotification } = JSON.parse(novuNotification.content as string)

    const { cta } = v1

    const actions: NovuNotificationAction[] = Object.keys(cta).map((key: string) => {
      return { action: getNormalizedNotificationAction(key, cta[key]) }
    })

    const notificationId =
      v1.type === 'info' ? NotificationMessageCategory.NovuInfo : NotificationMessageCategory.NovuWarning

    return {
      trackId: notificationId,
      id: notificationId,
      novuId: novuNotification._id,
      title: v1.title,
      body: v1.body,
      read: novuNotification.read,
      seen: novuNotification.seen,
      createTime: new Date(novuNotification.createdAt),
      acknowledged: novuNotification.read,
      actions,
      osNotification,
    }
  } catch (e) {
    return null
  }
}

interface NotificationActionData {
  label: string
  onClick: () => void
}

const getReceivedAtDisplay = (
  createTime: Date,
): { value: number; unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' } => {
  const createTimeLuxon = DateTime.fromJSDate(createTime)
  const duration = DateTime.now().diff(createTimeLuxon)
  const interval = duration.shiftTo('years', 'months', 'days', 'hours', 'minutes', 'seconds').toObject()
  if (interval.years !== undefined && interval.years >= 1) {
    return { value: interval.years, unit: 'year' }
  }
  if (interval.months !== undefined && interval.months >= 1) {
    return { value: interval.months, unit: 'month' }
  }
  if (interval.days !== undefined && interval.days >= 1) {
    return { value: interval.days, unit: 'day' }
  }
  if (interval.hours !== undefined && interval.hours >= 1) {
    return { value: interval.hours, unit: 'hour' }
  }
  if (interval.minutes !== undefined && interval.minutes >= 1) {
    return { value: Math.ceil(interval.minutes), unit: 'minute' }
  }

  return { value: interval.seconds ? Math.ceil(interval.seconds) : 0, unit: 'second' }
}

export const getConfiguredNovuBannerNotifications = (
  novuNotifications: IMessage[] | undefined,
  onAcknowledge: (notificationID: string) => void,
  onDismiss: (notificationID: string) => void,
  onReadNovuNotification: (id?: string) => void,
): NotificationBannerProps[] => {
  if (!novuNotifications) {
    return []
  }

  const getNotificationAction = (
    notification: NovuNotification,
    action?: NovuNotificationAction,
  ): NotificationActionData => {
    switch (action?.action?.$case) {
      case 'acknowledge': {
        return {
          label: action.action.acknowledge.title,
          onClick: () => onReadNovuNotification(notification.novuId),
        }
      }
      case 'dismiss': {
        return {
          label: action.action.dismiss.title,
          onClick: () => onDismiss(notification.id),
        }
      }
      default:
        return {
          label: '',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick: () => {},
        }
    }
  }

  const configuredNovuBannerNotifications: (NotificationBannerProps | null)[] = novuNotifications.map(
    (notification) => {
      const normalizedNotification = getNormalizedNovuNotification(notification)

      if (!normalizedNotification) {
        return null
      }

      const { createTime, id: notificationId, title, body, trackId, actions } = normalizedNotification
      const firstNotificationAction = actions[0]
      const secondNotificationAction = actions[1]
      const variant = trackId === NotificationMessageCategory.NovuInfo ? 'news' : 'error'

      return {
        action1: getNotificationAction(normalizedNotification, firstNotificationAction),
        action2: getNotificationAction(normalizedNotification, secondNotificationAction),
        message: body,
        onClose: () => onAcknowledge(notificationId),
        receivedAt: createTime ? getReceivedAtDisplay(createTime) : { value: 1, unit: 'minute' },
        title,
        variant,
      }
    },
  )

  return configuredNovuBannerNotifications.filter((notification) => notification !== null) as NotificationBannerProps[]
}
