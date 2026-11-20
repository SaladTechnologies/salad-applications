import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import type { Session } from '../../data/session.ts'
import { SessionContext } from '../../data/session.ts'

/** What the page was told about the user. */
interface Page {
  authenticated: boolean | undefined
}

/** The pages the container rendered. */
const fake = vi.hoisted(() => ({ pages: [] as Page[] }))

vi.mock('../../Store', () => ({
  getStore: () => ({
    analytics: { trackButtonClicked: vi.fn() },
    balance: { currentBalance: 5 },
    rewards: {
      getReward: () => undefined,
      selectedTargetReward: undefined,
      isReviewing: false,
      setSelectedTargetReward: vi.fn(),
      removeSelectedTargetReward: vi.fn(),
    },
    solanaWallet: { walletAddress: undefined, isLoading: false, loadWallet: vi.fn() },
    coinbaseEmail: { email: undefined, isLoading: false, isLoadError: false, loadEmail: vi.fn() },
  }),
}))

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
})
