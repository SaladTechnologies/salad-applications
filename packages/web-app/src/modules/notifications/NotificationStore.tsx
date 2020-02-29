import React from 'react'
import { RootStore } from '../../Store'
import { NotificationMessage } from './models'
import { toast } from 'react-toastify'
import { NotificationToast } from './components/NotificationToast'

export class NotificationStore {
  constructor(private readonly store: RootStore) {}

  /**
   * Shows a notification to the user
   * @param message The notification message
   * @param error Is this an error message?
   * @param desktop Should the notification be sent as a desktop notification?
   * @param inApp Should the notification be shown as an in app notification?
   */
  sendNotification = (
    message: NotificationMessage,
    error: boolean = false,
    desktop: boolean = false,
    inApp: boolean = true,
  ) => {
    if (desktop) {
      this.store.native.send('show-notification', message)
    }
    if (inApp) {
      if (message.id && toast.isActive(message.id)) {
        toast.update(message.id, {
          render: <NotificationToast {...message} error={error} />,
          toastId: message.id,
          className: 'hide-toast', //This hides the default toast styles
          bodyClassName: 'hide-toast', //This hides the default toast styles
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: error ? false : 15000,
          closeButton: false,
          hideProgressBar: true,
        })
      } else {
        toast(<NotificationToast {...message} error={error} />, {
          toastId: message.id,
          className: 'hide-toast', //This hides the default toast styles
          bodyClassName: 'hide-toast', //This hides the default toast styles
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: error ? false : 15000,
          closeButton: false,
          hideProgressBar: true,
        })
      }
    }
  }

  removeNotification = (id: number) => {
    this.store.native.send('show-notification', { remove: id, close: id })
    toast.dismiss(id)
  }
}
