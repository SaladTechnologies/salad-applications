import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { RootStore } from '../../Store'
import { AuthStore, ChallengeSudoModeTrigger } from './AuthStore'

describe('AuthStore.resetUserData', () => {
  it('forgets the protected action waiting for sudo mode and its trigger', () => {
    const auth = new AuthStore({} as RootStore, {} as AxiosInstance, vi.fn())
    auth.setPendingProtectedAction({ method: 'post', url: '/api/v2/backup-codes' })
    auth.setChallengeSudoModeTrigger(ChallengeSudoModeTrigger.RewardRedeem)

    auth.resetUserData()

    expect(auth.pendingProtectedAction).toBeUndefined()
    expect(auth.challengeSudoModeTrigger).toBeUndefined()
  })
})
