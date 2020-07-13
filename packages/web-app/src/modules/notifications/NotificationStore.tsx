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
   */
  sendNotification = (message: NotificationMessage) => {
    if (message.showDesktop) {
      this.store.native.send('show-notification', message)
    }

    const toastComponent = (
      <NotificationToast {...message} isError={message.type === 'error'} onClick={message.onClick} />
    )

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
      })
    }
  }

  removeNotification = (id: number) => {
    this.store.native.send('show-notification', { remove: id, close: id })
    toast.dismiss(id)
  }
}
