import { describe, expect, it, vi } from 'vitest'
import { startButton } from './start-button.ts'

describe('startButton', () => {
  it('is Login while signed out or while the session is unknown, and runs the login', () => {
    const onLogin = vi.fn<() => void>()

    const signedOut = startButton(false, onLogin)
    const unknown = startButton(undefined, onLogin)
    signedOut.onClick()

    expect(signedOut.label).toBe('Login')
    expect(unknown.label).toBe('Login')
    expect(onLogin).toHaveBeenCalledExactlyOnceWith()
  })

  it('is Download while signed in, and opens the download page in a new tab', () => {
    const onLogin = vi.fn<() => void>()
    const open = vi.spyOn(globalThis, 'open').mockReturnValue(null)

    const signedIn = startButton(true, onLogin)
    signedIn.onClick()
    const opened = [...open.mock.calls]
    open.mockRestore()

    expect(signedIn.label).toBe('Download')
    expect(opened).toStrictEqual([['https://salad.com/download', '_blank']])
    expect(onLogin).not.toHaveBeenCalled()
  })
})
