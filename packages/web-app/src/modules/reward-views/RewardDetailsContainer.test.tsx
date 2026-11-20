import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'
import type { Session } from '../../data/session.ts'
import { SessionContext } from '../../data/session.ts'

/** What the page was told about the user. */
interface Page {
  authenticated: boolean | undefined
  solanaWalletAddress: string | undefined
  coinbaseEmail: string | undefined
  currentBalance: number
  lastRedemption: { id: string } | undefined
}

/** The pages the container rendered, and the saved wallet and email, which the test changes. */
const fake = vi.hoisted(() => ({
  pages: [] as Page[],
  wallet: undefined as unknown as ReturnType<typeof createExternalState<{ walletAddress: string | undefined }>>,
  email: undefined as unknown as ReturnType<typeof createExternalState<{ email: string | undefined }>>,
  balance: undefined as unknown as ReturnType<typeof createExternalState<{ currentBalance: number }>>,
  vault: undefined as unknown as ReturnType<typeof createExternalState<{ redemptions: { id: string }[] }>>,
}))

vi.mock('../../Store', () => {
  const balance = { state: fake.balance }
  const vault = { state: fake.vault }
  return {
    getStore: () => ({
      analytics: { trackButtonClicked: vi.fn() },
      balance,
      vault,
      rewards: {
        getReward: () => undefined,
        selectedTargetReward: undefined,
        isReviewing: false,
        setSelectedTargetReward: vi.fn(),
        removeSelectedTargetReward: vi.fn(),
      },
      solanaWallet: { ...fake.wallet, loadWallet: vi.fn() },
      coinbaseEmail: { ...fake.email, loadEmail: vi.fn() },
    }),
  }
})

vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({}), useQueryClient: () => ({}) }))
vi.mock('../../data/http-context.ts', () => ({ useHttp: () => ({}) }))
vi.mock('../../routing/navigation-context.ts', () => ({ useNavigation: () => ({ goBackOr: vi.fn() }) }))
vi.mock('../../account/profile.ts', () => ({ useProfile: () => undefined }))

/** Stands in for the page: it records what it is given, so the test needs no styles or garden components. */
vi.mock('./pages', () => ({
  RewardDetailsPage: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))

fake.wallet = createExternalState<{ walletAddress: string | undefined }>({ walletAddress: undefined })
fake.email = createExternalState<{ email: string | undefined }>({ email: undefined })
fake.balance = createExternalState({ currentBalance: 5 })
fake.vault = createExternalState<{ redemptions: { id: string }[] }>({ redemptions: [] })
const { RewardDetailsContainer } = await import('./RewardDetailsContainer')

describe('RewardDetailsContainer', () => {
  it('tells the page whether the user is signed in, which gates the wallet and Coinbase email checks', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    const render = (session: Session): boolean | undefined => {
      act(() => {
        root.render(
          <SessionContext.Provider value={session}>
            <RewardDetailsContainer match={{ params: { id: 'reward' } }} backFallback="/store" />
          </SessionContext.Provider>,
        )
      })
      return fake.pages.at(-1)?.authenticated
    }

    const unknown = render('unknown')
    const signedOut = render('no')
    const signedIn = render('yes')
    act(() => {
      root.unmount()
    })

    expect(unknown).toBeUndefined()
    expect(signedOut).toBe(false)
    expect(signedIn).toBe(true)
  })

  it('shows the page the balance and the latest redemption as they change', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<RewardDetailsContainer match={{ params: { id: 'reward' } }} backFallback="/store" />)
    })
    const before = fake.pages.at(-1)

    act(() => {
      fake.balance.update({ currentBalance: 2.5 })
      fake.vault.update({ redemptions: [{ id: 'older' }, { id: 'latest' }] })
    })
    const after = fake.pages.at(-1)
    act(() => {
      root.unmount()
    })

    expect([before?.currentBalance, before?.lastRedemption]).toStrictEqual([5, undefined])
    expect([after?.currentBalance, after?.lastRedemption]).toStrictEqual([2.5, { id: 'latest' }])
  })

  it('shows the page the saved wallet and email as soon as they load', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<RewardDetailsContainer match={{ params: { id: 'reward' } }} backFallback="/store" />)
    })
    const before = fake.pages.at(-1)

    act(() => {
      fake.wallet.update({ walletAddress: 'wallet' })
      fake.email.update({ email: 'chef@example.com' })
    })
    const after = fake.pages.at(-1)
    act(() => {
      root.unmount()
    })

    expect([before?.solanaWalletAddress, before?.coinbaseEmail]).toStrictEqual([undefined, undefined])
    expect([after?.solanaWalletAddress, after?.coinbaseEmail]).toStrictEqual(['wallet', 'chef@example.com'])
  })
})
