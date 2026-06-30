import { observer } from 'mobx-react'
import type { FC, ReactNode } from 'react'
import { Fragment, useEffect } from 'react'
import { getStore } from '../../../../Store'
import {
  formatRenderRewardPrice,
  getRenderRewardPrice,
  isRenderReward,
  renderRewardsEnabled,
  rewardNameSuggestsRender,
  type RenderPriceableReward,
} from '../../../render'

export interface RewardPriceProps {
  /** The reward whose price is being displayed. */
  reward?: RenderPriceableReward
  /**
   * The reward's id. Supplied by the lean list/card views (storefront, search) whose payloads omit `tags`, so the
   * authoritative reward can be fetched to confirm and price a RENDER reward. Omit it on surfaces (detail, checkout)
   * whose `reward` already carries `tags`.
   */
  rewardId?: string
  /**
   * The reward's display name. Used only as a cheap gate (via {@link rewardNameSuggestsRender}) to decide whether the
   * authoritative reward is worth fetching, so non-RENDER stores issue no extra requests. Supplied alongside `rewardId`.
   */
  rewardName?: string
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
 *
 * The detail/checkout call sites pass a `reward` that already carries `tags`, so RENDER pricing resolves directly from
 * it. The storefront/search list and card views, however, only have lean payloads that omit `tags` entirely — there is
 * no way to detect a RENDER reward from them. For those, when the reward's name suggests RENDER, the authoritative
 * reward is fetched (the same source the detail page uses) and its `tags`/price drive the displayed figure. The fetched
 * reward's tag remains the source of truth, so a name-only false positive simply falls back to the regular price.
 */
const _RewardPrice: FC<RewardPriceProps> = ({ reward, rewardId, rewardName, fallback }) => {
  const store = getStore()
  const render = store.render
  const rewardStore = store.rewards

  // The lean list/card payloads omit `tags`, so a RENDER reward can't be detected from them directly. When the name
  // suggests RENDER, fetch the authoritative reward to confirm and price it; gating on the name keeps stores with no
  // RENDER rewards (e.g. production) from issuing any extra requests.
  const leanIsRender = isRenderReward(reward)
  const shouldEnrich = renderRewardsEnabled && !leanIsRender && !!rewardId && rewardNameSuggestsRender(rewardName)
  const enrichedReward = shouldEnrich ? rewardStore.getReward(rewardId) : undefined

  const isRender = renderRewardsEnabled && (leanIsRender || isRenderReward(enrichedReward))
  // Keep the live rate warm for confirmed RENDER rewards and for candidates still awaiting their confirming fetch, so
  // the price is ready as soon as the reward resolves.
  const shouldPoll = renderRewardsEnabled && (leanIsRender || shouldEnrich)

  useEffect(() => {
    if (shouldEnrich) {
      rewardStore.ensureRewardLoaded(rewardId)
    }
  }, [shouldEnrich, rewardId, rewardStore])

  useEffect(() => {
    if (!shouldPoll) {
      return
    }
    render.startPollingExchangeRate()
    return () => render.stopPollingExchangeRate()
  }, [shouldPoll, render])

  if (!isRender) {
    return <Fragment>{fallback}</Fragment>
  }

  // Prefer the lean reward when it already declares the tag (detail/checkout); otherwise price from the fetched reward.
  const priceableReward = leanIsRender ? reward : enrichedReward
  const price = getRenderRewardPrice(priceableReward, render.exchangeRate?.rate)
  if (price === undefined) {
    return <Fragment>{fallback}</Fragment>
  }

  return <Fragment>{formatRenderRewardPrice(price)}</Fragment>
}

export const RewardPrice = observer(_RewardPrice)
