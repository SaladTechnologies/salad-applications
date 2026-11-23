import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'
import type { Session } from '../../data/session.ts'
import { SessionContext } from '../../data/session.ts'

/** What the navigation bar shows for the user. */
interface Bar {
  balance: number | undefined
  username: string | undefined
  rightSideButtonLabel: string | undefined
  rightSideButtonClick: (() => void) | undefined
  startButtonLabel: string
  onClickAvatar: () => void
  onClickViewAllBonuses: () => void
  onInternalRoute: (path: string) => void
  onSelectTargetRewardClick: () => void
  onOpenTargetRewardClick: () => void
  targetReward: { canBeRedeemed: boolean } | null
}

/** The store the container reads, with only what it uses, and the bars it rendered. */
const fake = vi.hoisted(() => ({
  login: vi.fn<() => Promise<void>>(),
  push: vi.fn<(path: string) => void>(),
  bars: [] as Bar[],
  balance: undefined as unknown as ReturnType<typeof createExternalState<{ currentBalance: number }>>,
  rewards: undefined as unknown as ReturnType<
    typeof createExternalState<{ rewards: Map<string, object>; selectedTargetRewardId: string | undefined }>
  >,
}))

vi.mock('../../Store', () => {
  const balance = { state: fake.balance }
  return {
    useStore: () => ({
      auth: { login: fake.login, logout: vi.fn() },
      analytics: { trackButtonClicked: vi.fn() },
      balance,
      rewards: { state: fake.rewards, removeSelectedTargetReward: vi.fn() },
      profile: { withInstallReminder: () => false, setIsInstallReminderClosed: vi.fn() },
      bonuses: { claim: vi.fn() },
    }),
  }
})

vi.mock('../../routing/navigation-context.ts', () => ({ useNavigation: () => ({ push: fake.push }) }))
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

fake.balance = createExternalState({ currentBalance: 5 })
fake.rewards = createExternalState<{ rewards: Map<string, object>; selectedTargetRewardId: string | undefined }>({
  rewards: new Map(),
  selectedTargetRewardId: undefined,
})
const { NavigationBarContainer } = await import('./NavigationBarContainer')

/** Returns what the bar shows for the user, without its functions. */
const shown = (bar: Bar | undefined) => ({
  balance: bar?.balance,
  username: bar?.username,
  rightSideButtonLabel: bar?.rightSideButtonLabel,
  startButtonLabel: bar?.startButtonLabel,
})

describe('NavigationBarContainer', () => {
  it('shows the balance, and whether the target reward can be bought, as the balance changes', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    fake.rewards.update({
      rewards: new Map([['target', { id: 'target', name: 'Target', price: 4 }]]),
      selectedTargetRewardId: 'target',
    })
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(
        <SessionContext.Provider value="yes">
          <NavigationBarContainer />
        </SessionContext.Provider>,
      )
    })
    const before = fake.bars.at(-1)

    act(() => {
      fake.balance.update({ currentBalance: 3.5 })
    })
    const after = fake.bars.at(-1)
    act(() => {
      root.unmount()
    })
    fake.rewards.update({ selectedTargetRewardId: undefined })
    fake.balance.update({ currentBalance: 5 })

    expect([before?.balance, before?.targetReward?.canBeRedeemed]).toStrictEqual([5, true])
    expect([after?.balance, after?.targetReward?.canBeRedeemed]).toStrictEqual([3.5, false])
  })

  it('shows the target reward once it loads after the bar is shown', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(
        <SessionContext.Provider value="yes">
          <NavigationBarContainer />
        </SessionContext.Provider>,
      )
    })
    const before = fake.bars.at(-1)

    act(() => {
      fake.rewards.update({
        rewards: new Map([['target', { id: 'target', name: 'Target', price: 4 }]]),
        selectedTargetRewardId: 'target',
      })
    })
    const after = fake.bars.at(-1)
    act(() => {
      root.unmount()
    })
    fake.rewards.update({ selectedTargetRewardId: undefined })

    expect(before?.targetReward).toBeNull()
    expect(after?.targetReward).toMatchObject({ canBeRedeemed: true })
  })

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

  it('goes to the account, the bonuses, the target reward and the links it is given', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    fake.rewards.update({
      rewards: new Map([['target', { id: 'target', name: 'Target', price: 4 }]]),
      selectedTargetRewardId: 'target',
    })
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(
        <SessionContext.Provider value="yes">
          <NavigationBarContainer />
        </SessionContext.Provider>,
      )
    })
    const bar = fake.bars.at(-1)
    act(() => {
      root.unmount()
    })
    fake.rewards.update({ selectedTargetRewardId: undefined })
    fake.push.mockClear()

    bar?.onClickAvatar()
    bar?.onClickViewAllBonuses()
    bar?.onSelectTargetRewardClick()
    bar?.onOpenTargetRewardClick()
    bar?.onInternalRoute('/earn/summary')

    expect(fake.push.mock.calls).toStrictEqual([
      ['/account/summary'],
      ['/account/bonuses'],
      ['/store/select-target-reward'],
      ['/store/rewards/target'],
      ['/earn/summary'],
    ])
  })
})
