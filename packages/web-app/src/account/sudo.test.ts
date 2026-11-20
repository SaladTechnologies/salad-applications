import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { createSudo, sudoTriggers } from './sudo.ts'

/** Sudo mode over a fake App API whose sudo request grants (204) or refuses (401), and the URLs it was sent. */
const setUp = (granted: boolean): { sudo: ReturnType<typeof createSudo>; posts: string[] } => {
  const posts: string[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    posts.push(String(config.url))
    const response = { data: '', status: granted ? 204 : 401, statusText: '', headers: new AxiosHeaders(), config }
    if (!granted) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, config, undefined, response)
    }
    return response
  }
  return { sudo: createSudo({ http: create({ adapter }) }), posts }
}

describe('sudo', () => {
  it('asks the App API for sudo mode, and records nothing when it grants it', async () => {
    expect.hasAssertions()
    const { sudo, posts } = setUp(true)

    const response = await sudo.challengeSudoMode(sudoTriggers.RewardRedeem)

    expect(posts).toStrictEqual(['/api/v2/authentication-sessions/sudo'])
    expect(response?.status).toBe(204)
    expect(sudo.get().challengeSudoModeTrigger).toBeUndefined()
  })

  it('records what asked when the App API refuses, and returns null', async () => {
    expect.hasAssertions()
    const { sudo } = setUp(false)

    const response = await sudo.challengeSudoMode(sudoTriggers.RewardRedeem)

    expect(response).toBeNull()
    expect(sudo.get().challengeSudoModeTrigger).toBe('RewardRedeem')
  })

  it('starts Google sign-in only once sudo mode is granted', async () => {
    expect.hasAssertions()
    const granted = setUp(true)
    const refused = setUp(false)
    const signInGranted = vi.fn<() => void>()
    const signInRefused = vi.fn<() => void>()

    await granted.sudo.signInWithGoogleChallengeSudoMode(signInGranted)
    await refused.sudo.signInWithGoogleChallengeSudoMode(signInRefused)

    expect(signInGranted).toHaveBeenCalledExactlyOnceWith()
    expect(signInRefused).not.toHaveBeenCalled()
    expect(refused.sudo.get().challengeSudoModeTrigger).toBe('GoogleSignIn')
  })

  it('tells listeners of each change, and forgets the waiting action and trigger on sign-out', () => {
    const { sudo } = setUp(true)
    const listener = vi.fn<() => void>()
    sudo.subscribe(listener)
    sudo.setPendingProtectedAction({ method: 'post', url: '/api/v2/backup-codes' })
    sudo.setChallengeSudoModeTrigger(sudoTriggers.GoogleSignIn)
    const waiting = sudo.get()

    sudo.resetUserData()

    expect(waiting).toStrictEqual({
      pendingProtectedAction: { method: 'post', url: '/api/v2/backup-codes' },
      challengeSudoModeTrigger: 'GoogleSignIn',
    })
    expect(sudo.get()).toStrictEqual({ pendingProtectedAction: undefined, challengeSudoModeTrigger: undefined })
    expect(listener).toHaveBeenCalledTimes(3)
  })
})
