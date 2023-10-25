import type { IMessage } from '@novu/shared'
import type { NotificationBannerProps as GardenNotificationBannerProps } from '@saladtechnologies/garden-components'
import { unescape } from 'lodash'
import type { Notification, NotificationAction } from './models'

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
    const { cta, title, body, badgeUrl, type } = v1

    const actions: NotificationAction[] = Object.keys(cta).map((key: string) => {
      return { action: getNormalizedNotificationAction(key, cta[key]) }
    })

    return {
      novuId: novuNotification._id,
      title,
      body,
      read: novuNotification.read,
      seen: novuNotification.seen,
      createdDate: new Date(novuNotification.createdAt),
      acknowledged: novuNotification.read,
      badgeUrl,
      actions,
      overlay,
      osNotification,
      variant: type === 'info' ? 'news' : type,
    }
  } catch (e) {
    return null
  }
}

interface NotificationActionPayload {
  label: string
  onClick: () => void
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

      const { createdDate, title, body, overlay, variant, actions, novuId, badgeUrl } = normalizedNotification
      const firstNotificationAction = actions[0]
      const secondNotificationAction = actions[1]

      return {
        action1: getNotificationBannerAction(normalizedNotification, onReadNovuNotification, firstNotificationAction),
        action2: getNotificationBannerAction(normalizedNotification, onReadNovuNotification, secondNotificationAction),
        message: unescape(body),
        onClose: () => onReadNovuNotification(novuId),
        createdDate: createdDate ?? new Date(),
        title: unescape(title),
        badgeUrl,
        variant,
        overlay,
      }
    },
  )

  return configuredNovuBannerNotifications.filter((notification) => notification !== null) as NotificationBannerProps[]
}
