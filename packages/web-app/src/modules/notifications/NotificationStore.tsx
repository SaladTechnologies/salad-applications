import { toast } from 'react-toastify'
import { RootStore } from '../../Store'
import { NotificationToast } from './components/NotificationToast'
import { NotificationMessage } from './models'

export class NotificationStore {
  constructor(private readonly store: RootStore) {}

  /**
   * Shows a notification to the user
   * @param message The notification message
   */
  sendNotification = (message: NotificationMessage) => {
    if (message.showDesktop) {
      this.store.native.send('show-notification', message)
    }

    const handleClick = () => {
      if (message.onClick) {
        this.store.analytics.trackToastNotificationClicked(message)
        message.onClick()
      }
    }

    const onOpen = () => {
      this.store.analytics.trackToastNotificationShown(message)
    }

    const onClose = () => {
      if (!message.autoClose) {
        this.store.analytics.trackToastNotificationClosed(message)
      }
    }

    const toastComponent = <NotificationToast {...message} isError={message.type === 'error'} onClick={handleClick} />

    //Checks to see if a mess
    if (message.id && toast.isActive(message.id)) {
      toast.update(message.id, {
        render: toastComponent,
        toastId: message.id,
        className: 'hide-toast', //This hides the default toast styles
        bodyClassName: 'hide-toast', //This hides the default toast styles
        position: toast.POSITION.BOTTOM_LEFT as 'bottom-left',
        autoClose: message.autoClose,
        closeButton: false,
        hideProgressBar: true,
        onOpen,
        onClose,
      })
    } else {
      toast(toastComponent, {
        toastId: message.id,
        className: 'hide-toast', //This hides the default toast styles
        bodyClassName: 'hide-toast', //This hides the default toast styles
        position: toast.POSITION.BOTTOM_LEFT as 'bottom-left',
        autoClose: message.autoClose,
        closeButton: false,
        hideProgressBar: true,
        onOpen,
        onClose,
      })
    }
  }

  removeNotification = (id: number) => {
    this.store.native.send('show-notification', { remove: id, close: id })
    toast.dismiss(id)
  }
}
