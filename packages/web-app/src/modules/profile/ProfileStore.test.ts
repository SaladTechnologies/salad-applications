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
    auth: { isAuthenticated: true },
    routing: { replace: vi.fn<(path: string) => void>() },
    notifications: { sendNotification: vi.fn<(message: unknown) => void>() },
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

  it('shows a selected avatar at once, then the one the App API selected, and tells its readers', async () => {
    const patch = vi.fn().mockResolvedValue({ data: { id: 'b' } })
    const { profileStore } = setUp(
      { get: vi.fn().mockResolvedValue({ data: [{ id: 'a' }, { id: 'b' }] }), patch },
      profile,
    )
    await profileStore.loadAvatars()
    const listener = vi.fn<() => void>()
    profileStore.subscribe(listener)

    const selecting = profileStore.selectAvatar('b')
    const whileSelecting = profileStore.getState()
    await selecting

    expect(whileSelecting).toMatchObject({ selectedAvatar: 'b', submittingAvatar: 'b' })
    expect(profileStore.getState()).toMatchObject({
      currentSelectedAvatar: 'b',
      selectedAvatar: 'b',
      submittingAvatar: undefined,
    })
    expect(patch).toHaveBeenCalledExactlyOnceWith('/api/v2/avatars/selected', { avatarId: 'b' })
    expect(listener).toHaveBeenCalled()
  })

  it('shows the avatar error and the last selected avatar when a selection fails', async () => {
    const patch = vi.fn().mockRejectedValue(new Error('down'))
    const get = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: 'a' }, { id: 'b' }] })
      .mockResolvedValueOnce({ data: { id: 'a' } })
    const { profileStore } = setUp({ get, patch }, profile)
    await profileStore.loadAvatars()
    await profileStore.loadSelectedAvatar()

    await profileStore.selectAvatar('b')

    expect(profileStore.getState()).toMatchObject({
      avatarError: { avatar: 'b', message: 'Unable to select avatar' },
      selectedAvatar: 'a',
      submittingAvatar: undefined,
    })
  })

  it('shows the install reminder only while it is not closed', () => {
    const { profileStore } = setUp({}, undefined)
    const newChef = { ...profile, createdAt: '2026-01-01T00:00:00Z' }

    expect(profileStore.withInstallReminder(newChef, false)).toBe(true)
    expect(profileStore.withInstallReminder(newChef, true)).toBe(false)
  })

  it('shows the protect-redemption status while it saves, then clears it after six seconds', async () => {
    vi.useFakeTimers()
    const post = vi.fn().mockResolvedValue({})
    const { profileStore } = setUp({ post, get: vi.fn().mockResolvedValue({ data: profile }) }, profile)

    const saving = profileStore.setProtectRewardsRedemption(true)
    const whileSaving = profileStore.getState().protectRewardsRedemptionStatus
    await saving
    const saved = profileStore.getState().protectRewardsRedemptionStatus
    await vi.advanceTimersByTimeAsync(6000)
    vi.useRealTimers()

    expect(whileSaving).toBe('loading')
    expect(saved).toBe('success')
    expect(profileStore.getState().protectRewardsRedemptionStatus).toBe('unknown')
  })

  it('forgets the selected avatar and the connected Google account on sign-out', async () => {
    const { profileStore } = setUp(
      { get: vi.fn().mockResolvedValue({ data: [{ loginProvider: 'Google', email: 'me@gmail.com' }] }) },
      profile,
    )
    await profileStore.loadGoogleAccountConnection()
    const connected = profileStore.getState().connectedGoogleAccountEmail

    profileStore.resetUserData()

    expect(connected).toBe('me@gmail.com')
    expect(profileStore.getState()).toMatchObject({
      connectedGoogleAccountEmail: undefined,
      currentSelectedAvatar: undefined,
      selectedAvatar: undefined,
      protectRewardsRedemptionStatus: 'unknown',
    })
  })
})
