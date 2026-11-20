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
  const sendNotification = vi.fn<(message: unknown) => void>()
  const store = {
    engagement: { checkWhatsNew },
    errorBoundary: { showErrorBoundary, resetErrorBoundary },
    routing: { replace: vi.fn<(path: string) => void>() },
    notifications: { sendNotification },
  } as unknown as RootStore
  return {
    profileStore: new ProfileStore(store, http as AxiosInstance, profiles),
    holder,
    checkWhatsNew,
    showErrorBoundary,
    resetErrorBoundary,
    sendNotification,
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

  it.each([
    [
      'Success',
      {
        category: 'Success',
        title: 'Your Accounts were Successfully Linked',
        message: 'Your Salad account and Google account are now connected.',
      },
    ],
    [
      'Failed',
      {
        category: 'Error',
        title: 'Account Connection Failed',
        message: `We're having trouble connecting your account. Please try again.`,
        type: 'error',
      },
    ],
  ])('shows the Google connection toast when the connection ends with %s', (status, toast) => {
    const { profileStore, sendNotification } = setUp({}, undefined)
    vi.stubGlobal('window', {
      location: { search: `?external-login-status=${status}&external-login-action=OneTimeCodeFlow` },
    })

    profileStore.connectExternalAccountProvider()
    vi.unstubAllGlobals()

    expect(sendNotification).toHaveBeenCalledExactlyOnceWith(toast)
  })

  it('shows the install reminder only while it is not closed and the user is signed in', () => {
    const { profileStore } = setUp({}, undefined)
    const newChef = { ...profile, createdAt: '2026-01-01T00:00:00Z' }

    expect(profileStore.withInstallReminder(newChef, false, true)).toBe(true)
    expect(profileStore.withInstallReminder(newChef, true, true)).toBe(false)
    expect(profileStore.withInstallReminder(newChef, false, false)).toBe(false)
    expect(profileStore.withInstallReminder(newChef, false, undefined)).toBe(false)
  })

  it('tells its readers when the install reminder is closed, and stores it', () => {
    const { profileStore } = setUp({}, undefined)
    const listener = vi.fn<() => void>()
    profileStore.subscribe(listener)
    const before = profileStore.getState().isInstallReminderClosed

    profileStore.setIsInstallReminderClosed(true)

    expect(before).toBe(false)
    expect(profileStore.getState().isInstallReminderClosed).toBe(true)
    expect(listener).toHaveBeenCalled()
    // Stored, so the reminder stays closed after a reload.
    expect(localStorage.getItem('SALAD_IS_INSTALL_REMINDER_CLOSED')).toBe('true')
  })

  it('shows the protect-redemption status while it saves, then clears it six seconds later', async () => {
    vi.useFakeTimers()
    const post = vi.fn().mockResolvedValue({})
    const { profileStore } = setUp({ post, get: vi.fn().mockResolvedValue({ data: profile }) }, profile)

    const saving = profileStore.setProtectRewardsRedemption(true)
    const whileSaving = profileStore.getState().protectRewardsRedemptionStatus
    await saving
    await vi.advanceTimersByTimeAsync(5999)
    const justBefore = profileStore.getState().protectRewardsRedemptionStatus
    await vi.advanceTimersByTimeAsync(1)
    vi.useRealTimers()

    expect(whileSaving).toBe('loading')
    expect(justBefore).toBe('success')
    expect(profileStore.getState().protectRewardsRedemptionStatus).toBe('unknown')
  })

  it('stops the last six-second clear when another change starts', async () => {
    vi.useFakeTimers()
    const post = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockReturnValueOnce(new Promise(() => undefined))
    const { profileStore } = setUp({ post, get: vi.fn().mockResolvedValue({ data: profile }) }, profile)

    await profileStore.setProtectRewardsRedemption(true)
    await vi.advanceTimersByTimeAsync(3000)
    void profileStore.setProtectRewardsRedemption(false)
    await vi.advanceTimersByTimeAsync(3000)
    vi.useRealTimers()

    expect(profileStore.getState().protectRewardsRedemptionStatus).toBe('loading')
  })

  it('checks for what is new after a username or Minecraft username change', async () => {
    const patch = vi.fn().mockResolvedValue({ data: profile })
    const username = setUp({ patch }, profile)
    const minecraft = setUp({ patch }, profile)

    await username.profileStore.updateUsername({ input: 'new-chef' })
    await minecraft.profileStore.updateMinecraftUsername({ input: 'steve' })

    expect(username.checkWhatsNew).toHaveBeenCalledTimes(1)
    expect(minecraft.checkWhatsNew).toHaveBeenCalledTimes(1)
  })

  it('forgets the selected avatar, the connected Google account and the protect status on sign-out', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: 'a' } })
      .mockResolvedValueOnce({ data: [{ loginProvider: 'Google', email: 'me@gmail.com' }] })
    const { profileStore } = setUp({ get }, profile)
    await profileStore.loadSelectedAvatar()
    await profileStore.loadGoogleAccountConnection()
    profileStore.setProtectRewardsRedemptionStatus('failure')
    const signedIn = profileStore.getState()

    profileStore.resetUserData()

    expect(signedIn).toMatchObject({
      connectedGoogleAccountEmail: 'me@gmail.com',
      currentSelectedAvatar: 'a',
      selectedAvatar: 'a',
      protectRewardsRedemptionStatus: 'failure',
    })
    expect(profileStore.getState()).toMatchObject({
      connectedGoogleAccountEmail: undefined,
      currentSelectedAvatar: undefined,
      selectedAvatar: undefined,
      protectRewardsRedemptionStatus: 'unknown',
    })
  })
})
