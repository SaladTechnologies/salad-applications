import classnames from 'classnames'
import { DateTime } from 'luxon'
import type { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { renderQuoteDisplayDecimals } from '../../../render'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  containerCheckout: {
    alignItems: 'flex-start',
    paddingTop: 6,
  },
  amountText: {
    // Book weight (rather than the thin Light09) and the header's light-green keep the token amount clearly legible
    // against the dark reward-detail header.
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  freshnessText: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
    color: theme.lightGreen,
    opacity: 0.85,
    textTransform: 'uppercase',
  },
  // Checkout (order summary) renders on a white modal, so the green used on the dark detail header is illegible there.
  // A darker green and larger type keep the exchange-rate amount and "quoted at" line readable.
  amountTextCheckout: {
    color: theme.darkGreen,
    fontFamily: theme.fontGroteskMedium25,
    fontSize: 20,
  },
  freshnessTextCheckout: {
    color: theme.darkGreen,
    fontSize: 12,
    opacity: 1,
  },
  staleText: {
    color: theme.orange,
    opacity: 1,
  },
  errorText: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
    color: theme.lightGreen,
    opacity: 0.85,
  },
  errorTextCheckout: {
    color: theme.darkGreen,
    fontSize: 12,
    opacity: 1,
  },
  skeleton: {
    width: 90,
  },
})

const renderTokenFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: renderQuoteDisplayDecimals,
})

// The detail header shows the live RENDER/USD rate as a currency value (e.g. `$0.9997`), pinned to the same precision
// used to price the reward so the two figures stay consistent.
const renderRateFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: renderQuoteDisplayDecimals,
  maximumFractionDigits: renderQuoteDisplayDecimals,
})

export interface RenderPriceQuoteProps extends WithStyles<typeof styles> {
  /** Whether a quote request is currently in flight and no quote is available yet. */
  loading?: boolean
  /** Whether the most recent quote request failed. */
  error?: boolean
  /** Whether the currently displayed quote is stale. */
  stale?: boolean
  /** The number of RENDER tokens the reward's Salad Balance value converts to. Shown in the `checkout` variant. */
  tokenAmount?: number
  /** The current price of a single RENDER token, in USD. Shown as the per-token rate in the `detail` variant. */
  rate?: number
  /** When the displayed quote was generated. */
  asOf?: Date
  /** Controls layout/labelling for the detail header vs. the checkout review surface. */
  variant?: 'detail' | 'checkout'
}

const _RenderPriceQuote: FC<RenderPriceQuoteProps> = ({
  classes,
  loading,
  error,
  stale,
  tokenAmount,
  rate,
  asOf,
  variant = 'detail',
}) => {
  const isCheckout = variant === 'checkout'
  const containerClass = isCheckout ? `${classes.container} ${classes.containerCheckout}` : classes.container
  const amountClass = isCheckout ? `${classes.amountText} ${classes.amountTextCheckout}` : classes.amountText
  const errorClass = isCheckout ? `${classes.errorText} ${classes.errorTextCheckout}` : classes.errorText

  // The checkout variant shows how many RENDER tokens the balance buys; the detail variant shows the per-token rate.
  const value = isCheckout ? tokenAmount : rate

  if (loading && value === undefined) {
    return (
      <div className={containerClass}>
        <div className={classes.skeleton}>
          <Skeleton />
        </div>
      </div>
    )
  }

  if (error && value === undefined) {
    return (
      <div className={containerClass}>
        <div className={errorClass}>RENDER price unavailable</div>
      </div>
    )
  }

  if (value === undefined) {
    return null
  }

  const asOfLabel = asOf ? DateTime.fromJSDate(asOf).toRelative() : undefined
  const freshnessText = stale
    ? 'Price may be out of date'
    : asOfLabel
    ? `Quoted ${asOfLabel}`
    : undefined

  const freshnessClass = classnames(classes.freshnessText, {
    [classes.freshnessTextCheckout]: isCheckout,
    [classes.staleText]: stale,
  })

  if (isCheckout) {
    // Label this explicitly as the tokens the Chef will receive so it isn't confused with the per-RENDER USD rate
    // shown on the reward detail page (the two are reciprocals of each other).
    return (
      <div className={containerClass}>
        <div className={amountClass}>You'll receive ≈ {renderTokenFormatter.format(value)} RENDER</div>
        {freshnessText && <div className={freshnessClass}>{freshnessText}</div>}
      </div>
    )
  }

  // Detail header: a single supporting line beneath the reward price that folds the live RENDER/USD rate, the
  // "per RENDER" label, and the freshness into one string — e.g. `$0.9997 per RENDER · quoted 9 seconds ago`. The
  // standalone rate line was removed so the figure above (the reward price) is not duplicated; this line keeps the
  // smaller freshness styling/font.
  const rateLabel = `${renderRateFormatter.format(value)} per RENDER`
  const detailText = freshnessText ? `${rateLabel} · ${freshnessText}` : rateLabel

  return (
    <div className={containerClass}>
      <div className={freshnessClass}>{detailText}</div>
    </div>
  )
}

export const RenderPriceQuote = withStyles(styles)(_RenderPriceQuote)
