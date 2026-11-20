import type { AxiosInstance } from 'axios'
import { runInAction } from 'mobx'
import type { ReactElement } from 'react'
import { act, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createBackupCodes } from '../../account/backup-codes'
import type { PendingProtectedAction, SudoTrigger } from '../../account/sudo'
import { createSudo } from '../../account/sudo'
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

const reward = { id: 'reward-1' }

/** What a replay did: where it navigated, what it called, and what sudo mode holds after it. */
interface Outcome {
  pushes: string[]
  pushStates: unknown[]
  calls: string[]
  sudoAfter: unknown
}

/**
 * Opens the protected-action page with `pending` (and `trigger`) waiting, runs the replay as the app runs it once the
 * user is verified, and reports what it did. `withReward` is whether the last redeemed reward is still known.
 */
const replay = async ({
  pending,
  trigger,
  withReward = true,
  run = true,
}: {
  pending?: PendingProtectedAction
  trigger?: SudoTrigger
  withReward?: boolean
  run?: boolean
}): Promise<Outcome> => {
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  const pushes: string[] = []
  const pushStates: unknown[] = []
  const calls: string[] = []
  // A stand-in router that renders a navigation as a normal update, after the history changes, as the app's does. The
  // bug it guards is a store update re-rendering the page between the two, which happens whatever the router.
  const router = { path: '/protected-action', navigate: (_path: string): void => undefined }
  const App = (): ReactElement | null => {
    const [path, setPath] = useState('/protected-action')
    router.navigate = setPath
    return path === '/protected-action' ? <ProtectedActionPageContainer /> : null
  }
  const http = { post: async () => ({ data: { codes: ['a'], createdAt: '' } }) } as unknown as AxiosInstance
  const sudo = createSudo({ http })
  sudo.setPendingProtectedAction(pending)
  sudo.setChallengeSudoModeTrigger(trigger)
  const passkeyState = createExternalState({ isPasskeySupported: true, hasVerifyWithPasskeyFailed: false })
  fake.store = {
    sudo,
    routing: {
      get location() {
        return { pathname: router.path }
      },
      push: (path: string, state?: unknown) => {
        pushes.push(path)
        pushStates.push(state)
        router.path = path
        router.navigate(path)
      },
    },
    backupCodes: createBackupCodes({ http, onVerified: () => undefined }),
    passkey: {
      get: passkeyState.get,
      subscribe: passkeyState.subscribe,
      setHasVerifyWithPasskeyFailed: () => undefined,
      verifyWithPasskey: async () => undefined,
      registerPasskey: () => calls.push('registerPasskey'),
      deletePasskey: (id: string) => calls.push(`deletePasskey ${id}`),
    },
    profile: {
      setProtectRewardsRedemption: (enabled: boolean) => calls.push(`setProtectRewardsRedemption ${enabled}`),
      setProtectRewardsRedemptionStatus: (status: string) => calls.push(`setProtectRewardsRedemptionStatus ${status}`),
    },
    rewards: {
      lastRewardId: reward.id,
      getReward: (id: string) => (withReward && id === reward.id ? reward : undefined),
      // A redemption navigates later, once its checkout opens.
      redeemReward: (redeemed: { id: string }) => calls.push(`redeemReward ${redeemed.id}`),
    },
  }
  const root = createRoot(document.createElement('div'))
  act(() => {
    root.render(<App />)
  })
  if (run) {
    await act(async () => {
      runInAction(() => {
        handlePendingProtectedAction(fake.store as Parameters<typeof handlePendingProtectedAction>[0])
      })
      await Promise.resolve()
    })
  }
  act(() => {
    root.unmount()
  })
  return { pushes, pushStates, calls, sudoAfter: sudo.get() }
}

const nothingWaiting = { pendingProtectedAction: undefined, challengeSudoModeTrigger: undefined }

describe('protected action page', () => {
  it('lets a replayed backup code generation reach the backup codes page, not the account', async () => {
    const outcome = await replay({ pending: { method: 'post', url: '/api/v2/backup-codes' } })

    expect(outcome.pushes).toStrictEqual(['/account/backup-codes'])
    expect(outcome.sudoAfter).toStrictEqual(nothingWaiting)
  })

  it('takes a replayed backup code view to the backup codes page', async () => {
    const outcome = await replay({ pending: { method: 'get', url: '/api/v2/backup-codes' } })

    expect(outcome.pushes).toStrictEqual(['/account/backup-codes'])
  })

  it('registers a passkey on the account page after a replayed passkey create', async () => {
    const outcome = await replay({ pending: { method: 'post', url: '/api/v2/passkeys/credentials/options' } })

    expect(outcome.pushes).toStrictEqual(['/account/summary'])
    expect(outcome.calls).toStrictEqual(['registerPasskey'])
  })

  it('deletes the passkey after a replayed passkey delete', async () => {
    const outcome = await replay({ pending: { method: 'delete', url: '/api/v2/passkeys/pk-1' } })

    expect(outcome.calls).toStrictEqual(['deletePasskey pk-1'])
    expect(outcome.pushes).toStrictEqual(['/account/summary'])
  })

  it('turns redemption protection on after a replayed request to, and reports a failure otherwise', async () => {
    const on = await replay({
      pending: { method: 'post', url: '/api/v1/profile/redemptions/tfa', data: { redemptionsTfaEnabled: true } },
    })
    const off = await replay({
      pending: { method: 'post', url: '/api/v1/profile/redemptions/tfa', data: { redemptionsTfaEnabled: false } },
    })

    expect(on.calls).toStrictEqual(['setProtectRewardsRedemption true'])
    expect(on.pushes).toStrictEqual(['/account/summary'])
    expect(off.calls).toStrictEqual(['setProtectRewardsRedemptionStatus failure'])
  })

  it('redeems the last reward again after a replayed redemption, and goes to the store without one', async () => {
    const known = await replay({ pending: { method: 'post', url: '/api/v2/redemptions' } })
    const unknown = await replay({ pending: { method: 'post', url: '/api/v2/redemptions' }, withReward: false })

    expect(known.calls).toStrictEqual(['redeemReward reward-1'])
    // The redemption navigates later, so the page, with nothing waiting, goes to the account meanwhile, as before.
    expect(known.pushes).toStrictEqual(['/account'])
    expect(unknown.pushes).toStrictEqual(['/store'])
    expect(known.sudoAfter).toStrictEqual(nothingWaiting)
  })

  it('reopens Google sign-in, or redeems the reward, after a replayed sudo challenge', async () => {
    const sudoUrl = '/api/v2/authentication-sessions/sudo'
    const google = await replay({ pending: { method: 'post', url: sudoUrl }, trigger: 'GoogleSignIn' })
    const redeem = await replay({ pending: { method: 'post', url: sudoUrl }, trigger: 'RewardRedeem' })

    expect(google.pushes).toStrictEqual(['/account/summary'])
    expect(google.pushStates).toStrictEqual([{ isGoogleSignInFormTriggered: true }])
    expect(google.sudoAfter).toStrictEqual(nothingWaiting)
    expect(redeem.calls).toStrictEqual(['redeemReward reward-1'])
  })

  it('goes to the account when opened with nothing waiting', async () => {
    const outcome = await replay({ run: false })

    expect(outcome.pushes).toStrictEqual(['/account'])
  })
})
