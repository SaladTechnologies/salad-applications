import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import type { Session } from '../../data/session.ts'
import { SessionContext } from '../../data/session.ts'

/** What the navigation bar shows for the user. */
interface Bar {
  balance: number | undefined
  username: string | undefined
  rightSideButtonLabel: string | undefined
  rightSideButtonClick: (() => void) | undefined
  startButtonLabel: string
}

/** The store the container reads, with only what it uses, and the bars it rendered. */
const fake = vi.hoisted(() => ({
  login: vi.fn<() => Promise<void>>(),
  bars: [] as Bar[],
}))

vi.mock('../../Store', () => ({
  getStore: () => ({
    auth: { login: fake.login, logout: vi.fn() },
    analytics: { trackButtonClicked: vi.fn() },
    balance: { currentBalance: 5 },
    rewards: { selectedTargetReward: undefined, removeSelectedTargetReward: vi.fn() },
    profile: { withInstallReminder: () => false, setIsInstallReminderClosed: vi.fn() },
    routing: { push: vi.fn() },
    bonuses: { claim: vi.fn() },
  }),
}))

vi.mock('../../account/referrals.ts', () => ({ useReferralCode: () => ({ enabled: false }) }))
vi.mock('../../account/bonuses.ts', () => ({
  useUnclaimedBonuses: () => [undefined],
  useBonusClaims: () => ({ pending: new Set() }),
}))
vi.mock('../../account/profile.ts', () => ({ useProfile: () => ({ username: 'chef' }) }))
vi.mock('../../account/profile-state.ts', () => ({
  useProfileState: () => ({ isInstallReminderClosed: false }),
  profileAvatarOf: () => undefined,
}))
vi.mock('@saladtechnologies/garden-components', () => ({
  Avatar: () => null,
  AvatarDefault: () => null,
  BonusCard: () => null,
}))

/** Stands in for the bar: it records what it is given, so the test needs no styles or garden components. */
vi.mock('./components/NavigationBarWithNotifications', () => ({
  NavigationBarWithNotifications: (bar: Bar) => {
    fake.bars.push(bar)
    return null
  },
}))

const { NavigationBarContainer } = await import('./NavigationBarContainer')

/** Returns what the bar shows for the user, without its functions. */
const shown = (bar: Bar | undefined) => ({
  balance: bar?.balance,
  username: bar?.username,
  rightSideButtonLabel: bar?.rightSideButtonLabel,
  startButtonLabel: bar?.startButtonLabel,
})

describe('NavigationBarContainer', () => {
  it('follows the session: Login while unknown or signed out, the balance and name while signed in, and back on sign-out', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    const render = (session: Session): Bar | undefined => {
      act(() => {
        root.render(
          <SessionContext.Provider value={session}>
            <NavigationBarContainer />
          </SessionContext.Provider>,
        )
      })
      return fake.bars.at(-1)
    }

    const unknown = render('unknown')
    const signedOut = render('no')
    signedOut?.rightSideButtonClick?.()
    const signedIn = render('yes')
    const signedOutAgain = render('no')
    act(() => {
      root.unmount()
    })

    const loggedOutBar = {
      balance: undefined,
      username: undefined,
      rightSideButtonLabel: 'Login',
      startButtonLabel: 'Login',
    }
    expect(shown(unknown)).toStrictEqual(loggedOutBar)
    expect(shown(signedOut)).toStrictEqual(loggedOutBar)
    expect(fake.login).toHaveBeenCalledExactlyOnceWith()
    expect(shown(signedIn)).toStrictEqual({
      balance: 5,
      username: 'chef',
      rightSideButtonLabel: undefined,
      startButtonLabel: 'Download',
    })
    expect(shown(signedOutAgain)).toStrictEqual(loggedOutBar)
  })
})
