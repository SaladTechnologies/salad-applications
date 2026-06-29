import { observer } from 'mobx-react'
import type { FC, ReactNode } from 'react'
import { Fragment, useEffect } from 'react'
import { getStore } from '../../../../Store'
import {
  formatRenderRewardPrice,
  getRenderRewardPrice,
  isRenderReward,
  renderRewardsEnabled,
  type RenderPriceableReward,
} from '../../../render'

export interface RewardPriceProps {
  /** The reward whose price is being displayed. */
  reward?: RenderPriceableReward
  /**
   * The price to display for non-RENDER rewards (and for RENDER rewards before a live exchange rate is available).
   * This preserves each call site's existing formatting/markup for regular rewards.
   */
  fallback: ReactNode
}

/**
 * The single source of truth for rendering a reward's displayed price.
 *
 * For RENDER rewards (and only while the {@link renderRewardsEnabled} flag is on) this shows the live, exchange-rate
 * derived price — `productValue * rate`, formatted to four decimal places — and keeps it fresh via the
 * {@link import('../../../render').RenderStore} poll loop. For every other reward, and whenever a RENDER quote is not
 * yet available, it simply renders the supplied {@link RewardPriceProps.fallback}, leaving regular pricing untouched.
 *
 * Implemented as a component (rather than a hook) so it can be used inside `.map` loops and class components alike.
 */
const _RewardPrice: FC<RewardPriceProps> = ({ reward, fallback }) => {
  const isRender = renderRewardsEnabled && isRenderReward(reward)
  const render = getStore().render

  useEffect(() => {
    if (!isRender) {
      return
    }
    render.startPollingExchangeRate()
    return () => render.stopPollingExchangeRate()
  }, [isRender, render])

  if (!isRender) {
    return <Fragment>{fallback}</Fragment>
  }

  const price = getRenderRewardPrice(reward, render.exchangeRate?.rate)
  if (price === undefined) {
    return <Fragment>{fallback}</Fragment>
  }

  return <Fragment>{formatRenderRewardPrice(price)}</Fragment>
}

export const RewardPrice = observer(_RewardPrice)
