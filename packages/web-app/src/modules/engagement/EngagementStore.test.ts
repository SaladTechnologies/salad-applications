import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { RootStore } from '../../Store'
import { EngagementStore } from './EngagementStore'

/** The parts of the root store the engagement store reads, with spies for what it does. */
const setUp = (lastSeenApplicationVersion: string) => {
  const sendNotification = vi.fn()
  const setWhatsNewViewed = vi.fn()
  let isAuthenticated: boolean | undefined
  const root = {
    auth: { isAuthenticated: () => isAuthenticated },
    profile: {
      currentProfile: undefined as { lastSeenApplicationVersion: string } | undefined,
      setWhatsNewViewed,
    },
    notifications: { sendNotification },
  }
  const axios = { get: vi.fn().mockResolvedValue({ data: { lastUpdated: '2026.11' } }) }
  const store = new EngagementStore(root as unknown as RootStore, axios as unknown as AxiosInstance)
  const signIn = (): void => {
    isAuthenticated = true
    root.profile.currentProfile = { lastSeenApplicationVersion }
  }
  return { store, signIn, sendNotification, setWhatsNewViewed }
}

/** Waits for the changelog load. */
const loaded = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('EngagementStore', () => {
  it('shows Salad was Updated once, when sign-in comes after the changelog', async () => {
    expect.hasAssertions()
    const { store, signIn, sendNotification, setWhatsNewViewed } = setUp('2026.10')
    await loaded()
    const beforeSignIn = sendNotification.mock.calls.length

    signIn()
    store.checkWhatsNew()
    store.checkWhatsNew()

    expect(beforeSignIn).toBe(0)
    expect(sendNotification).toHaveBeenCalledOnce()
    expect(sendNotification.mock.calls[0]?.[0]).toMatchObject({ title: 'Salad was Updated', autoClose: false })
    expect(setWhatsNewViewed).toHaveBeenCalledOnce()
  })

  it('shows Salad was Updated when the changelog loads after sign-in', async () => {
    expect.hasAssertions()
    const { signIn, sendNotification } = setUp('2026.10')

    signIn()
    await loaded()

    expect(sendNotification).toHaveBeenCalledOnce()
  })

  it('never shows it when the profile has seen the version, even on a later check', async () => {
    expect.hasAssertions()
    const { store, signIn, sendNotification, setWhatsNewViewed } = setUp('2026.11')
    signIn()
    await loaded()

    store.checkWhatsNew()

    expect(sendNotification).not.toHaveBeenCalled()
    expect(setWhatsNewViewed).not.toHaveBeenCalled()
  })
})
