import { useNotifications } from '@novu/notification-center'
import { NotificationBanner } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { getConfiguredNovuBannerNotifications } from '../../../notifications/utils'

const styles = () => ({
  container: {
    width: 560,
    position: 'fixed',
    zIndex: 99,
    top: 85,
    left: 0,
    right: 0,
    margin: 'auto',
  },
})

interface NovuNotificationBannerRawProps extends WithStyles<typeof styles> {}

export const NovuNotificationBannerRaw: FC<NovuNotificationBannerRawProps> = ({ classes }) => {
  const { notifications, markNotificationAsRead } = useNotifications()
  const [isHidden, setisHidden] = useState(false)

  const unreadNovuNotifications = notifications?.filter((notification) => !notification.read)
  const bannerNotifications = getConfiguredNovuBannerNotifications(
    unreadNovuNotifications,
    (notificationId: string) => {
      markNotificationAsRead(notificationId)
      setisHidden(true)
    },
  )
  const overlayNovuNotifications = bannerNotifications?.filter((notification) => notification.overlay)
  const lastOverlayNovuNotification = overlayNovuNotifications[0]

  useEffect(() => {
    setisHidden(false)
  }, [notifications, setisHidden])

  if (!lastOverlayNovuNotification || isHidden) {
    return null
  }

  return (
    <div className={classes.container}>
      <NotificationBanner {...lastOverlayNovuNotification} />
    </div>
  )
}

export const NovuNotificationBanner = withStyles(styles)(NovuNotificationBannerRaw)
