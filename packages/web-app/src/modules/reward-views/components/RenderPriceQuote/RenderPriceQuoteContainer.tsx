import { observer } from 'mobx-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { getStore } from '../../../../Store'
import { computeRenderQuote, getRenderRewardPrice, isRenderReward, renderRewardsEnabled } from '../../../render'
import type { Reward } from '../../../reward/models'
import { RenderPriceQuote } from './RenderPriceQuote'

export interface RenderPriceQuoteContainerProps {
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
 * Renders nothing — and triggers no network activity — unless the internal {@link renderRewardsEnabled} flag is
 * on and the reward is a RENDER reward. While active it keeps the quote fresh via the {@link RenderStore} poll loop.
 */
const _RenderPriceQuoteContainer: FC<RenderPriceQuoteContainerProps> = ({ reward, saladBalance, variant }) => {
  const active = renderRewardsEnabled && isRenderReward(reward)
  const store = getStore()
  const render = store.render

  useEffect(() => {
    if (!active) {
      return
    }
    render.startPollingExchangeRate()
    return () => render.stopPollingExchangeRate()
  }, [active, render])

  // The number of RENDER tokens the Chef receives is the reward's fixed grant — the same figure the displayed price is
  // derived from (`grant * rate`). Converting the reward's RENDER price back through the rate yields exactly that grant
  // and keeps the order-summary "you'll receive" line consistent with the per-RENDER rate and the line item/total.
  // Dividing the raw Salad Balance price (`reward.price`) by the rate instead would reintroduce the rate and disagree
  // with those figures (e.g. show 1.0003 RENDER for a $0.9997 / 1-token reward).
  const rate = render.exchangeRate?.rate
  const renderPrice = getRenderRewardPrice(reward, rate)
  const amount = renderPrice ?? saladBalance ?? reward?.price ?? 0
  const tokenAmount = render.exchangeRate ? computeRenderQuote(amount, render.exchangeRate.rate) : undefined

  useEffect(() => {
    if (active && reward && tokenAmount !== undefined) {
      store.analytics.trackRenderPriceQuoteViewed(reward, tokenAmount, render.exchangeRate?.rate)
    }
    // Fire once per reward + quote pairing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reward?.id, tokenAmount])

  if (!active) {
    return null
  }

  return (
    <RenderPriceQuote
      loading={render.isLoadingExchangeRate}
      error={render.hasExchangeRateError}
      stale={render.isExchangeRateStale}
      tokenAmount={tokenAmount}
      rate={render.exchangeRate?.rate}
      asOf={render.exchangeRate?.asOf}
      variant={variant}
    />
  )
}

export const RenderPriceQuoteContainer = observer(_RenderPriceQuoteContainer)
