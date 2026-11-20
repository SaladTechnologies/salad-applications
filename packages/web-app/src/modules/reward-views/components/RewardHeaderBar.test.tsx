import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { coinbaseEmailRequiredTag } from '../../coinbase/constants'
import type { Reward } from '../../reward/models'
import { RewardHeaderBar } from './RewardHeaderBar'

// The module barrels also export stores, which pull in the root store and ESM-only `axios`. The header only needs the
// constants and tag helpers, so serve those alone.
vi.mock('../../coinbase', async () => ({
  ...(await vi.importActual<object>('../../coinbase/constants')),
  ...(await vi.importActual<object>('../../coinbase/utils')),
}))
vi.mock('../../solana-wallet', async () => ({
  ...(await vi.importActual<object>('../../solana-wallet/constants')),
  ...(await vi.importActual<object>('../../solana-wallet/utils')),
}))

// These pull in the root store; the tests only need their output to be inert.
vi.mock('../../../components', () => ({
  SmartLink: ({ to, children }: { to: string; children?: ReactNode }) => <a href={to}>{children}</a>,
  Button: ({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children?: ReactNode }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))
// The reward utils import ESM-only `query-string`; the header only uses getPercentOff, which no test here reaches.
vi.mock('../../reward/utils', () => ({
  getPercentOff: () => '',
}))
vi.mock('./RenderPriceQuote', () => ({
  RenderPriceQuoteContainer: () => null,
}))
vi.mock('./assets', () => ({
  IconArrowLeft: () => null,
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

describe('RewardHeaderBar with a Coinbase reward', () => {
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

  const renderHeader = (props: Record<string, unknown>) => {
    const loadCoinbaseEmail = vi.fn()
    act(() => {
      root.render(
        <RewardHeaderBar
          reward={coinbaseReward}
          authenticated
          currentBalance={100}
          requiresMinecraftUsername={false}
          loadCoinbaseEmail={loadCoinbaseEmail}
          trackDisabledBuyNowClick={vi.fn()}
          onRemoveTargetRewardClick={vi.fn()}
          onTargetThisRewardClick={vi.fn()}
          {...props}
        />,
      )
    })
    return { loadCoinbaseEmail }
  }

  const buyButton = () =>
    Array.from(container.querySelectorAll('button')).find((button) => button.textContent === 'BUY NOW')!

  it('loads the Coinbase email when signed in', () => {
    const { loadCoinbaseEmail } = renderHeader({})
    expect(loadCoinbaseEmail).toHaveBeenCalledTimes(1)
  })

  it('does not load the email or block Buy Now when signed out', () => {
    const { loadCoinbaseEmail } = renderHeader({ authenticated: false })

    expect(loadCoinbaseEmail).not.toHaveBeenCalled()
    expect(container.textContent).not.toContain('Add Coinbase Email')
    expect(buyButton().disabled).toBe(false)
  })

  it('replaces redeeming with a link to add a Coinbase email when none is saved', () => {
    renderHeader({ coinbaseEmail: undefined })

    const link = container.querySelector('a[href="/account/summary#coinbase-email"]')
    expect(link?.textContent).toBe('Add Coinbase Email')
    expect(buyButton().disabled).toBe(true)
  })

  it('blocks Buy Now and asks the Chef to check the email when it failed to load', () => {
    renderHeader({ coinbaseEmail: undefined, isCoinbaseEmailLoadError: true })

    expect(container.querySelector('a[href="/account/summary#coinbase-email"]')?.textContent).toBe(
      'Check Coinbase Email',
    )
    expect(buyButton().disabled).toBe(true)
  })

  it('shows the email the reward will be sent to and allows Buy Now when one is saved', () => {
    renderHeader({ coinbaseEmail: 'chef@example.com' })

    expect(container.textContent).toContain('Sends to Coinbase: chef@example.com')
    expect(container.textContent).not.toContain('Add Coinbase Email')
    expect(buyButton().disabled).toBe(false)
  })

  it('shows nothing Coinbase-specific for a reward without the Coinbase tag', () => {
    const { loadCoinbaseEmail } = renderHeader({ reward: { ...coinbaseReward, tags: ['render'] } })

    expect(loadCoinbaseEmail).not.toHaveBeenCalled()
    expect(container.textContent).not.toContain('Coinbase Email')
    expect(container.textContent).not.toContain('Sends to Coinbase')
    expect(buyButton().disabled).toBe(false)
  })
})
