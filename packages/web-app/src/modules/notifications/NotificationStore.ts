import { RootStore } from '../../Store'
import { NotificationMessage } from './models'

export class NotificationStore {
  constructor(private readonly store: RootStore) {}

  sendNotification = (message: NotificationMessage) => {
    this.store.native.send('show-notification', message)
  }

  removeNotification = (id: number) => {
    this.store.native.send('show-notification', { remove: id, close: id })
  }
}
