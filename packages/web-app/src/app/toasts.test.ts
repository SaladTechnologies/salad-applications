import { describe, expect, it, vi } from 'vitest'
import type { ToastMessage } from './toasts.ts'
import { createToasts } from './toasts.ts'

/** The options the toasts pass to react-toastify, as far as these tests read them. */
interface Options {
  render?: unknown
  onOpen?: () => void
  onClose?: () => void
}

const toastify = vi.hoisted(() => ({
  show: vi.fn<(content: unknown, options: Options) => void>(),
  isActive: vi.fn<(id: number) => boolean>(),
  update: vi.fn<(id: number, options: Options) => void>(),
}))

vi.mock(import('react-toastify'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    toast: Object.assign(toastify.show, actual.toast, { isActive: toastify.isActive, update: toastify.update }),
  }
})

/** A message the tests send. */
interface Message extends ToastMessage {
  title: string
}

/** The toasts, the spies they report to, and the last toast's click handler. */
interface Setup {
  send: (message: Message) => void
  shown: ReturnType<typeof vi.fn<(message: Message) => void>>
  clicked: ReturnType<typeof vi.fn<(message: Message) => void>>
  closed: ReturnType<typeof vi.fn<(message: Message) => void>>
  click: () => void
}

/** Does nothing: a toast's click handler before any toast is rendered. */
const noClick = (): void => undefined

/** Creates the toasts with spies; `active` is whether a toast with the message's id is showing. */
const setUp = (active = false): Setup => {
  toastify.show.mockClear()
  toastify.update.mockClear()
  toastify.isActive.mockReturnValue(active)
  const shown = vi.fn<(message: Message) => void>()
  const clicked = vi.fn<(message: Message) => void>()
  const closed = vi.fn<(message: Message) => void>()
  const clicks = { last: noClick }
  const { sendNotification } = createToasts<Message>({
    render: (message, onClick) => {
      clicks.last = onClick
      return message.title
    },
    onShown: shown,
    onClicked: clicked,
    onClosed: closed,
  })
  return {
    send: sendNotification,
    shown,
    clicked,
    closed,
    click: () => {
      clicks.last()
    },
  }
}

/** Returns the options of the last toast shown. */
const lastOptions = (): Options => toastify.show.mock.calls.at(-1)?.[1] ?? {}

describe('createToasts', () => {
  it('shows a toast at the bottom left with the app styles, its id, and its auto close', () => {
    const { send } = setUp()

    send({ title: 'Hi', id: 7, autoClose: 5000 })

    expect(toastify.show.mock.calls[0]?.[0]).toBe('Hi')
    expect(lastOptions()).toMatchObject({
      toastId: 7,
      className: 'hide-toast',
      bodyClassName: 'hide-toast',
      position: 'bottom-left',
      autoClose: 5000,
      closeButton: false,
      hideProgressBar: true,
    })
  })

  it('replaces a showing toast with the same id', () => {
    const { send } = setUp(true)

    send({ title: 'Again', id: 7 })

    expect(toastify.show).not.toHaveBeenCalled()
    expect(toastify.update.mock.calls[0]?.[0]).toBe(7)
    expect(toastify.update.mock.calls[0]?.[1]).toMatchObject({ render: 'Again', toastId: 7 })
    expect(toastify.update.mock.calls[0]?.[1]).toHaveProperty('autoClose')
  })

  it('never replaces a toast for id 0', () => {
    const { send } = setUp(true)

    send({ title: 'Zero', id: 0 })

    expect(toastify.update).not.toHaveBeenCalled()
    expect(lastOptions()).toMatchObject({ toastId: 0 })
  })

  it('reports a close for a toast with the default delay', () => {
    const { send, closed } = setUp()

    send({ title: 'Default' })
    lastOptions().onClose?.()

    expect(closed).toHaveBeenCalledExactlyOnceWith({ title: 'Default' })
  })

  it('reports a toast shown, and closed only when it does not close itself', () => {
    const autoClosing = setUp()
    autoClosing.send({ title: 'Auto', autoClose: 5000 })
    lastOptions().onOpen?.()
    lastOptions().onClose?.()
    const kept = setUp()
    kept.send({ title: 'Kept', autoClose: false })
    lastOptions().onClose?.()

    expect(autoClosing.shown).toHaveBeenCalledExactlyOnceWith({ title: 'Auto', autoClose: 5000 })
    expect(autoClosing.closed).not.toHaveBeenCalled()
    expect(kept.closed).toHaveBeenCalledExactlyOnceWith({ title: 'Kept', autoClose: false })
  })

  it('reports and runs a click only when the message has an onClick', () => {
    const withClick = setUp()
    const onClick = vi.fn<() => void>()
    withClick.send({ title: 'Go', onClick })
    withClick.click()
    const withoutClick = setUp()
    withoutClick.send({ title: 'Stay' })
    withoutClick.click()

    expect(withClick.clicked).toHaveBeenCalledExactlyOnceWith({ title: 'Go', onClick })
    expect(onClick).toHaveBeenCalledExactlyOnceWith()
    expect(withoutClick.clicked).not.toHaveBeenCalled()
  })
})
