import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useExternalState } from '../../../../app/external-state.ts'
import { useHttp } from '../../../../data/http-context.ts'
import { isExchangeRateStale } from '../../../render/utils'
import { renderExchangeRateQueryKey, renderExchangeRateRefreshRate } from '../../../../rewards/render.ts'
import { getStore } from '../../../../Store'
import { computeRenderQuote, isRenderReward, loadRenderExchangeRate } from '../../../render'
import type { Reward } from '../../../reward/models'
import { RenderPriceQuote } from './RenderPriceQuote'

interface RenderPriceQuoteContainerProps {
  /** The RENDER reward the quote is being shown for. */
  reward?: Reward
  /** The Salad Balance amount (USD) to convert into RENDER tokens. Defaults to the reward's price. */
  saladBalance?: number
  /** Controls layout/labelling for the detail header vs. the checkout review surface. */
  variant?: 'detail' | 'checkout'
}

/**
 * Surfaces a live RENDER price quote for a reward.
 *
 * Renders nothing — and triggers no network activity — unless the reward is a RENDER reward. While shown it fetches the
 * quote, and again every 30 seconds (also in a background tab, so the quote redemption sends stays fresh), into the
 * store's `render.exchangeRate`, which redemption reads.
 */
const _RenderPriceQuoteContainer: FC<RenderPriceQuoteContainerProps> = ({ reward, saladBalance, variant }) => {
  const active = isRenderReward(reward)
  const store = getStore()
  const render = store.render
  const { exchangeRate } = useExternalState(render.state)
  const http = useHttp()
  const quote = useQuery({
    queryKey: renderExchangeRateQueryKey,
    queryFn: () => loadRenderExchangeRate(http, render),
    enabled: active,
    staleTime: 0,
    refetchInterval: renderExchangeRateRefreshRate,
    refetchIntervalInBackground: true,
  })

  // A RENDER reward's Salad Balance cost is its plain `price` (shown like any other reward). The quote shows how many
  // RENDER tokens that cost converts to at the live rate — i.e. `cost / rate` — so the Chef sees what they'll receive.
  const rate = exchangeRate?.rate
  const saladBalanceCost = saladBalance ?? reward?.price ?? 0
  const tokenAmount = rate !== undefined ? computeRenderQuote(saladBalanceCost, rate) : undefined

  useEffect(() => {
    if (active && reward && tokenAmount !== undefined) {
      store.analytics.trackRenderPriceQuoteViewed(reward, tokenAmount, exchangeRate?.rate)
    }
    // Fire once per reward + quote pairing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reward?.id, tokenAmount])

  if (!active) {
    return null
  }

  return (
    <RenderPriceQuote
      loading={quote.isFetching}
      // A failed fetch shows until the next one starts, as the store's flag did.
      error={quote.isError && !quote.isFetching}
      stale={isExchangeRateStale(exchangeRate)}
      tokenAmount={tokenAmount}
      asOf={exchangeRate?.asOf}
      variant={variant}
    />
  )
}

export const RenderPriceQuoteContainer = _RenderPriceQuoteContainer
