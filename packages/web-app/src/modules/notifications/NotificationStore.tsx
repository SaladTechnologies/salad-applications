import { action, observable } from 'mobx'
import { toast } from 'react-toastify'
import type { RootStore } from '../../Store'
import { NotificationToast } from '../notifications-views/components'
import type { NotificationMessage } from './models'

export class NotificationStore {
  @observable
  public isNotificationsDrawerOpened: boolean = false

  constructor(private readonly store: RootStore) {}

  @action.bound
  openNotificationsDrawer = () => {
    this.isNotificationsDrawerOpened = true
  }

  @action.bound
  closeNotificationsDrawer = () => {
    this.isNotificationsDrawerOpened = false
  }

  /**
   * Shows a notification to the user
   * @param message The notification message
   */
  sendNotification = (message: NotificationMessage) => {
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
    toast.dismiss(id)
  }
}
