import type { ReactNode } from 'react'
import type { ToastOptions, UpdateOptions } from 'react-toastify'
import { toast } from 'react-toastify'

/** What a toast needs from a notification message. */
export interface ToastMessage {
  /** The toast's id. A message with the id of a toast that is still showing replaces that toast, unless the id is 0. */
  id?: number | undefined
  /**
   * The delay in milliseconds before the toast closes itself, `false` to keep it open, or none (or 0) for the
   * container's default delay.
   */
  autoClose?: number | false | undefined
  /** Called when the toast is clicked. */
  onClick?: (() => void) | undefined
}

/** How {@link createToasts} renders a toast and reports what happens to it. */
export interface ToastsOptions<Message extends ToastMessage> {
  /** Renders the toast's content. `onClick` is the toast's click handler, which reports the click and runs it. */
  render: (message: Message, onClick: () => void) => ReactNode
  /** Called when the toast shows. */
  onShown: (message: Message) => void
  /** Called when a toast that has an `onClick` is clicked, before `onClick` runs. */
  onClicked: (message: Message) => void
  /** Called when a toast without a delay of its own (`autoClose` `false`, 0, or none) is closed. */
  onClosed: (message: Message) => void
}

/** Shows notifications as toasts. */
export interface Toasts<Message extends ToastMessage> {
  /** Shows the message as a toast at the bottom left, or replaces the showing toast with the same id (other than 0). */
  sendNotification: (message: Message) => void
}

/** Creates the app's toasts, which react-toastify's `ToastContainer` in the app shows. */
export const createToasts = <Message extends ToastMessage>(options: ToastsOptions<Message>): Toasts<Message> => ({
  sendNotification: (message) => {
    const handleClick = (): void => {
      if (message.onClick) {
        options.onClicked(message)
        message.onClick()
      }
    }
    const settings: ToastOptions = {
      ...(message.id === undefined ? {} : { toastId: message.id }),
      // The app's toast content draws the whole toast, so react-toastify's own styles are hidden.
      className: 'hide-toast',
      bodyClassName: 'hide-toast',
      position: toast.POSITION.BOTTOM_LEFT,
      ...(message.autoClose === undefined ? {} : { autoClose: message.autoClose }),
      closeButton: false,
      hideProgressBar: true,
      onOpen: (): void => {
        options.onShown(message)
      },
      onClose: (): void => {
        // Reported only for a message without a delay of its own, as before: one with `false`, or none (which closes after
        // the container's default delay).
        if (message.autoClose === undefined || message.autoClose === false || message.autoClose === 0) {
          options.onClosed(message)
        }
      },
    }
    const content = options.render(message, handleClick)
    // An id of 0 never replaces a toast, as before.
    if (message.id !== undefined && message.id !== 0 && toast.isActive(message.id)) {
      // An update keeps the shown toast's options it doesn't name, so a message without a delay names it as null, which,
      // like the undefined the store passed, gives the toast the container's default delay.
      const update: UpdateOptions = { ...settings, render: content, autoClose: message.autoClose ?? null }
      toast.update(message.id, update)
    } else {
      toast(content, settings)
    }
  },
})
