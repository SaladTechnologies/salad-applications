import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import { useAccountSecurityLoads } from './account-security.ts'
import type { Profile } from './profile.ts'
import { currentProfile, forgetProfile, setProfile, useProfile } from './profile.ts'

/** Returns a profile with the username. */
const profileOf = (username: string): Profile => ({
  id: 'me',
  username,
  email: 'me@example.com',
  lastSeenApplicationVersion: undefined,
  redemptionTfaEnabled: false,
  saladBowlFirstLoginAt: undefined,
  createdAt: undefined,
  pendingTermsVersion: undefined,
})

/** Shows the profile's username. */
const ShowProfile = (): ReactElement => <span>{useProfile()?.username ?? 'none'}</span>

/** Loads nothing, as a fake passkeys load. */
const loadNothing = async (): Promise<void> => {
  await Promise.resolve()
}

/** Shows the profile's username, as an account summary page does, which reloads the profile when it opens. */
const AccountPage = ({ loadProfile }: { loadProfile: () => Promise<unknown> }): ReactElement => {
  useAccountSecurityLoads(loadNothing, loadProfile)
  return <ShowProfile />
}

describe('profile', () => {
  it('shows each profile the store keeps, and nothing once it forgets it', () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    const host = document.createElement('div')
    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <ShowProfile />
        </QueryClientProvider>,
      )
    })
    const shown: (string | null)[] = [host.textContent]

    act(() => {
      setProfile(queryClient, profileOf('chef'))
    })
    shown.push(host.textContent)
    act(() => {
      setProfile(queryClient, profileOf('renamed'))
    })
    shown.push(host.textContent)
    act(() => {
      forgetProfile(queryClient)
    })
    shown.push(host.textContent)

    expect(shown).toStrictEqual(['none', 'chef', 'renamed', 'none'])
  })

  it('keeps the profile for the session while nothing shows it, and forgets it on sign-out', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    setProfile(queryClient, profileOf('chef'))

    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    const kept = currentProfile(queryClient)?.username
    forgetSignedOutUser([], queryClient)
    vi.useRealTimers()

    expect(kept).toBe('chef')
    expect(currentProfile(queryClient)).toBeUndefined()
  })

  it('keeps showing the profile while an account page reloads it', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    setProfile(queryClient, profileOf('chef'))
    // Only the page's load shows `reloaded`.
    const loadProfile = async (): Promise<void> => {
      await Promise.resolve()
      setProfile(queryClient, profileOf('reloaded'))
    }
    const host = document.createElement('div')

    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <AccountPage loadProfile={loadProfile} />
        </QueryClientProvider>,
      )
    })
    // Until the page's loads have finished, and kept what they load.
    await act(async () => {
      await vi.waitFor(() => {
        expect(queryClient.isFetching()).toBe(0)
      })
    })

    expect(host.textContent).toBe('reloaded')
  })
})
