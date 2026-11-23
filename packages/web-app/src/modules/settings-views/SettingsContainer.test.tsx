import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import type { Session } from '../../data/session.ts'
import { SessionContext } from '../../data/session.ts'

/** The store the container reads, with only what it uses. */
const fake = vi.hoisted(() => ({
  logout: vi.fn<() => Promise<void>>(),
  menus: [] as { text: string; onClick: () => void }[][],
  closes: [] as (() => void)[],
  goBackOr: vi.fn<(fallback: string) => void>(),
}))

vi.mock('../../Store', () => ({
  useStore: () => ({
    auth: { logout: fake.logout },
    analytics: { trackButtonClicked: vi.fn(), trackSmartLink: vi.fn() },
  }),
}))

vi.mock('../../routing/navigation-context.ts', () => ({ useNavigation: () => ({ goBackOr: fake.goBackOr }) }))

vi.mock('../../account/referrals.ts', () => ({ useReferralCode: () => ({ enabled: false }) }))

/** Stands in for the page: it records the menu buttons it is given, so the test needs no styles or garden components. */
vi.mock('../../components', () => ({
  SettingsPage: ({
    menuButtons,
    onClose,
  }: {
    menuButtons: { text: string; onClick: () => void }[]
    onClose: () => void
  }) => {
    fake.menus.push(menuButtons)
    fake.closes.push(onClose)
    return null
  },
}))

const { SettingsContainer } = await import('./SettingsContainer')

describe('SettingsContainer', () => {
  it('shows Log out while the user is signed in, and drops it when they sign out', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    const render = (session: Session): void => {
      act(() => {
        root.render(
          <SessionContext.Provider value={session}>
            <SettingsContainer />
          </SessionContext.Provider>,
        )
      })
    }

    render('yes')
    const signedIn = fake.menus.at(-1)
    signedIn?.[0]?.onClick()
    render('no')
    const signedOut = fake.menus.at(-1)
    act(() => {
      root.unmount()
    })

    expect(signedIn?.map(({ text }) => text)).toStrictEqual(['Log out'])
    expect(fake.logout).toHaveBeenCalledOnce()
    expect(signedOut).toStrictEqual([])
  })

  it('goes back, or to the store, when the settings close', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(
        <SessionContext.Provider value="yes">
          <SettingsContainer />
        </SessionContext.Provider>,
      )
    })
    fake.closes.at(-1)?.()
    act(() => {
      root.unmount()
    })

    expect(fake.goBackOr.mock.calls).toStrictEqual([['/store']])
  })
})
