import type { IMessage } from '@novu/shared'
import type { NotificationBannerProps as GardenNotificationBannerProps } from '@saladtechnologies/garden-components'
import { DateTime } from 'luxon'
import { NotificationMessageCategory, type Notification, type NotificationAction } from './models'

interface NovuTemplateCta {
  acknowledgeLabel: string
  linkCTA: {
    linkLabel: string
    url: string
  }
}

type NovuTemplateCtaContent = NovuTemplateCta['acknowledgeLabel'] | NovuTemplateCta['linkCTA']
type NotificationBannerProps = GardenNotificationBannerProps & {
  overlay: boolean
}

const getNormalizedNotificationAction = (
  ctaKey: string,
  ctaContent: NovuTemplateCtaContent,
): NotificationAction['action'] => {
  switch (ctaKey) {
    case 'linkCTA': {
      return {
        $case: 'openLink',
        openLink: {
          link: (ctaContent as NovuTemplateCta['linkCTA']).url,
          title: (ctaContent as NovuTemplateCta['linkCTA']).linkLabel,
        },
      }
    }
    case 'acknowledgeLabel':
    default: {
      return {
        $case: 'acknowledge',
        acknowledge: {
          title: ctaContent as NovuTemplateCta['acknowledgeLabel'],
        },
      }
    }
  }
}

export interface IMessageWithId extends IMessage {
  id: string
}

export const getNormalizedNovuNotification = (novuNotification: IMessage): Notification | null => {
  try {
    const { v1, osNotification, overlay } = JSON.parse(novuNotification.content as string)

    const { cta } = v1

    const actions: NotificationAction[] = Object.keys(cta).map((key: string) => {
      return { action: getNormalizedNotificationAction(key, cta[key]) }
    })

    const trackId = v1.type === 'info' ? NotificationMessageCategory.NovuInfo : NotificationMessageCategory.NovuWarning

    return {
      trackId,
      novuId: novuNotification._id,
      title: v1.title,
      body: v1.body,
      read: novuNotification.read,
      seen: novuNotification.seen,
      createDate: new Date(novuNotification.createdAt),
      acknowledged: novuNotification.read,
      actions,
      overlay,
      osNotification,
    }
  } catch (e) {
    return null
  }
}

interface NotificationActionPayload {
  label: string
  onClick: () => void
}

const getReceivedAtDisplay = (
  createDate: Date,
): { value: number; unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' } => {
  const createDateLuxon = DateTime.fromJSDate(createDate)
  const duration = DateTime.now().diff(createDateLuxon)
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

const getNotificationBannerAction = (
  notification: Notification,
  onReadNovuNotification: (notificationId: string) => void,
  action?: NotificationAction,
): NotificationActionPayload => {
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
        onClick: () => onReadNovuNotification(notification.novuId),
      }
    }
    case 'openLink': {
      const openLink = action.action.openLink

      return {
        label: openLink.title,
        onClick: () => {
          window.open(openLink.link, '_blank')
          onReadNovuNotification(notification.novuId)
        },
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

export const getConfiguredNovuBannerNotifications = (
  novuNotifications: IMessage[] | undefined,
  onReadNovuNotification: (notificationId: string) => void,
): NotificationBannerProps[] => {
  if (!novuNotifications) {
    return []
  }

  const configuredNovuBannerNotifications: (NotificationBannerProps | null)[] = novuNotifications.map(
    (notification) => {
      const normalizedNotification = getNormalizedNovuNotification(notification)

      if (!normalizedNotification) {
        return null
      }

      const { createDate, title, body, overlay, trackId, actions, novuId } = normalizedNotification
      const firstNotificationAction = actions[0]
      const secondNotificationAction = actions[1]
      const variant = trackId === NotificationMessageCategory.NovuInfo ? 'news' : 'error'

      return {
        action1: getNotificationBannerAction(normalizedNotification, onReadNovuNotification, firstNotificationAction),
        action2: getNotificationBannerAction(normalizedNotification, onReadNovuNotification, secondNotificationAction),
        message: body,
        onClose: () => onReadNovuNotification(novuId),
        receivedAt: createDate ? getReceivedAtDisplay(createDate) : { value: 1, unit: 'minute' },
        title,
        variant,
        overlay,
      }
    },
  )

  return configuredNovuBannerNotifications.filter((notification) => notification !== null) as NotificationBannerProps[]
}
