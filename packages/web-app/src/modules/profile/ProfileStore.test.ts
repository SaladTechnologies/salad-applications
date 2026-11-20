import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { Profile } from '../../account/profile.ts'
import type { RootStore } from '../../Store'
import type { ProfileAccess } from './ProfileStore'
import { ProfileStore } from './ProfileStore'

const profile: Profile = {
  id: 'me',
  username: 'chef',
  email: 'me@example.com',
  lastSeenApplicationVersion: undefined,
  redemptionTfaEnabled: false,
  saladBowlFirstLoginAt: undefined,
  createdAt: undefined,
  pendingTermsVersion: undefined,
}

/** A profile store over a fake App API and a plain profile holder, with spies for what it tells the app. */
const setUp = (http: Partial<AxiosInstance>, kept: Profile | undefined) => {
  const holder = { profile: kept }
  const profiles: ProfileAccess = {
    get: () => holder.profile,
    set: (next) => {
      holder.profile = next
    },
    forget: () => {
      holder.profile = undefined
    },
  }
  const checkWhatsNew = vi.fn<() => void>()
  const showErrorBoundary = vi.fn<(error: Error) => void>()
  const resetErrorBoundary = vi.fn<() => void>()
  const store = {
    engagement: { checkWhatsNew },
    errorBoundary: { showErrorBoundary, resetErrorBoundary },
  } as unknown as RootStore
  return {
    profileStore: new ProfileStore(store, http as AxiosInstance, profiles),
    holder,
    checkWhatsNew,
    showErrorBoundary,
    resetErrorBoundary,
  }
}

describe('ProfileStore', () => {
  it('keeps a loaded profile, and forgets it when the load fails, then checks for what is new', async () => {
    const loaded = setUp({ get: vi.fn().mockResolvedValue({ data: profile }) }, undefined)
    const failed = setUp({ get: vi.fn().mockRejectedValue(new Error('down')) }, profile)

    const loadedResult = await loaded.profileStore.loadProfile()
    const failedResult = await failed.profileStore.loadProfile()

    expect(loadedResult).toBe(profile)
    expect(loaded.holder.profile).toBe(profile)
    expect(loaded.resetErrorBoundary).toHaveBeenCalledTimes(1)
    expect(loaded.checkWhatsNew).toHaveBeenCalledTimes(1)
    expect(failedResult).toBeUndefined()
    expect(failed.holder.profile).toBeUndefined()
    expect(failed.showErrorBoundary).toHaveBeenCalledTimes(1)
    expect(failed.checkWhatsNew).toHaveBeenCalledTimes(1)
  })

  it('shows a protect-redemption change at once as a new profile, leaving the shown one as it was', () => {
    const post = vi.fn().mockReturnValue(new Promise(() => undefined))
    const { profileStore, holder } = setUp({ post, get: vi.fn().mockResolvedValue({ data: profile }) }, profile)

    void profileStore.setProtectRewardsRedemption(true)

    expect(holder.profile).not.toBe(profile)
    expect(holder.profile).toStrictEqual({ ...profile, redemptionTfaEnabled: true })
    expect(profile.redemptionTfaEnabled).toBe(false)
  })
})
