import type { AxiosInstance } from 'axios'
import { action, observable, runInAction } from 'mobx'
import type { ReactElement } from 'react'
import { act, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createBackupCodes } from '../../account/backup-codes'
import { createExternalState } from '../../app/external-state'
import { handlePendingProtectedAction } from './utils'

/** The store the container and the replay read, with only what they use. */
const fake = vi.hoisted(() => ({ store: undefined as unknown }))

vi.mock('../../Store', () => ({ getStore: () => fake.store }))

/**
 * Stands in for the page: it keeps only the page's own redirect, which sends the user to their account when it renders
 * with no protected action waiting (as ProtectedActionPage does), so the test needs no styles or garden components.
 */
vi.mock('./components', () => ({
  ProtectedActionPage: ({
    withPendingProtectedAction,
    backToAccount,
  }: {
    withPendingProtectedAction: boolean
    backToAccount: () => void
  }) => {
    useEffect(() => {
      if (!withPendingProtectedAction) {
        backToAccount()
      }
    }, [withPendingProtectedAction, backToAccount])
    return null
  },
}))

const { ProtectedActionPageContainer } = await import('./ProtectedActionPageContainer')

describe('protected action page', () => {
  it('lets a replayed backup code generation reach the backup codes page, not the account', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const pushes: string[] = []
    // The router renders a navigation as a normal update, after a store's synchronous one, as the app's router does.
    const router = { navigate: (_path: string): void => undefined }
    const App = (): ReactElement | null => {
      const [path, setPath] = useState('/protected-action')
      router.navigate = setPath
      return path === '/protected-action' ? <ProtectedActionPageContainer /> : null
    }
    const auth = observable({
      pendingProtectedAction: { method: 'post', url: '/api/v2/backup-codes' } as
        { method: string; url: string } | undefined,
      challengeSudoModeTrigger: undefined as string | undefined,
    })
    const http = { post: async () => ({ data: { codes: ['a'], createdAt: '' } }) } as unknown as AxiosInstance
    const passkeyState = createExternalState({
      isPasskeySupported: true,
      hasVerifyWithPasskeyFailed: false,
    })
    fake.store = {
      auth: Object.assign(auth, {
        setPendingProtectedAction: action((pending: undefined) => {
          auth.pendingProtectedAction = pending
        }),
        setChallengeSudoModeTrigger: action((trigger: undefined) => {
          auth.challengeSudoModeTrigger = trigger
        }),
      }),
      routing: {
        push: (path: string) => {
          pushes.push(path)
          router.navigate(path)
        },
      },
      backupCodes: createBackupCodes({ http, onVerified: () => undefined }),
      passkey: {
        get: passkeyState.get,
        subscribe: passkeyState.subscribe,
        setHasVerifyWithPasskeyFailed: () => undefined,
        verifyWithPasskey: async () => undefined,
      },
    }
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<App />)
    })

    await act(async () => {
      runInAction(() => {
        handlePendingProtectedAction(fake.store as Parameters<typeof handlePendingProtectedAction>[0])
      })
      await Promise.resolve()
    })
    act(() => {
      root.unmount()
    })

    expect(pushes).toStrictEqual(['/account/backup-codes'])
  })
})
