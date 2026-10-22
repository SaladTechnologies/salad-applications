import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { coinbaseEmailRequiredTag } from '../../coinbase/constants'
import type { Reward } from '../../reward/models'
import { SaladPayOrderSummaryPage } from './SaladPayOrderSummaryPage'

// The module barrels also export stores, which pull in the root store and ESM-only `axios`. The page only needs the
// constants and tag helpers, so serve those alone.
jest.mock('../../coinbase', () => ({
  ...jest.requireActual('../../coinbase/constants'),
  ...jest.requireActual('../../coinbase/utils'),
}))
jest.mock('../../solana-wallet', () => ({
  ...jest.requireActual('../../solana-wallet/constants'),
  ...jest.requireActual('../../solana-wallet/utils'),
}))

// These pull in the root store; the tests only need their output to be inert.
jest.mock('../../../components', () => ({
  SmartLink: ({ to, children }: { to: string; children?: ReactNode }) => <a href={to}>{children}</a>,
  ModalPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}))
jest.mock('../../reward-views/components/RenderPriceQuote', () => ({
  RenderPriceQuoteContainer: () => null,
}))

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const coinbaseReward = {
  id: 'reward-1',
  name: '$5 RENDER to Coinbase',
  price: 5,
  tags: ['render', coinbaseEmailRequiredTag],
} as Reward

const request = {
  total: { label: 'Total', amount: 5 },
  displayItems: [{ label: coinbaseReward.name, amount: 5 }],
}

describe('SaladPayOrderSummaryPage with a Coinbase reward', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  const renderPage = (props: Record<string, unknown>) => {
    const onConfirm = jest.fn()
    const loadCoinbaseEmail = jest.fn()
    act(() => {
      root.render(
        <SaladPayOrderSummaryPage
          availableBalance={100}
          request={request}
          reward={coinbaseReward}
          onConfirm={onConfirm}
          onCloseClick={jest.fn()}
          onAbort={jest.fn()}
          loadCoinbaseEmail={loadCoinbaseEmail}
          {...props}
        />,
      )
    })
    return { onConfirm, loadCoinbaseEmail }
  }

  const clickConfirm = () => {
    // The checkout button is a div whose only text is its label.
    const button = Array.from(container.querySelectorAll('div')).find(
      (element) => element.textContent?.trim() === 'Pay With Salad',
    )
    expect(button).toBeDefined()
    act(() => (button as HTMLElement).click())
  }

  it('loads the Coinbase email', () => {
    const { loadCoinbaseEmail } = renderPage({})
    expect(loadCoinbaseEmail).toHaveBeenCalledTimes(1)
  })

  it('blocks checkout and links to settings when no email is saved', () => {
    const { onConfirm } = renderPage({ coinbaseEmail: undefined })

    expect(container.textContent).toContain('add your Coinbase email')
    expect(container.querySelector('a[href="/account/summary#coinbase-email"]')).not.toBeNull()
    clickConfirm()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('blocks checkout with a different message when the email failed to load', () => {
    const { onConfirm } = renderPage({ coinbaseEmail: undefined, isCoinbaseEmailLoadError: true })

    expect(container.textContent).toContain("We couldn't load your Coinbase email")
    clickConfirm()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('shows no warning while the email is loading', () => {
    renderPage({ coinbaseEmail: undefined, isCoinbaseEmailLoading: true })

    expect(container.textContent).not.toContain('add your Coinbase email')
  })

  it('shows where the reward will be sent and allows checkout when an email is saved', () => {
    const { onConfirm } = renderPage({ coinbaseEmail: 'chef@example.com' })

    expect(container.textContent).toContain('This reward will be sent to the Coinbase account for chef@example.com')
    expect(container.textContent).not.toContain('add your Coinbase email')
    clickConfirm()
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows nothing Coinbase-specific for a reward without the Coinbase tag', () => {
    const { loadCoinbaseEmail, onConfirm } = renderPage({ reward: { ...coinbaseReward, tags: ['render'] } })

    expect(loadCoinbaseEmail).not.toHaveBeenCalled()
    expect(container.textContent).not.toContain('Coinbase email')
    expect(container.textContent).not.toContain('Coinbase account')
    clickConfirm()
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
