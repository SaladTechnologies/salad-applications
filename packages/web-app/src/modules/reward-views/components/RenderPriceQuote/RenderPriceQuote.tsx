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
  },
  amountText: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  freshnessText: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 8,
    letterSpacing: 1,
    color: theme.green,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  staleText: {
    color: theme.orange,
    opacity: 1,
  },
  errorText: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
    color: theme.green,
    opacity: 0.7,
  },
  skeleton: {
    width: 90,
  },
})

const renderTokenFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: renderQuoteDisplayDecimals,
})

export interface RenderPriceQuoteProps extends WithStyles<typeof styles> {
  /** Whether a quote request is currently in flight and no quote is available yet. */
  loading?: boolean
  /** Whether the most recent quote request failed. */
  error?: boolean
  /** Whether the currently displayed quote is stale. */
  stale?: boolean
  /** The number of RENDER tokens the reward's Salad Balance value converts to. */
  tokenAmount?: number
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
  asOf,
  variant = 'detail',
}) => {
  const containerClass =
    variant === 'checkout' ? `${classes.container} ${classes.containerCheckout}` : classes.container

  if (loading && tokenAmount === undefined) {
    return (
      <div className={containerClass}>
        <div className={classes.skeleton}>
          <Skeleton />
        </div>
      </div>
    )
  }

  if (error && tokenAmount === undefined) {
    return (
      <div className={containerClass}>
        <div className={classes.errorText}>RENDER price unavailable</div>
      </div>
    )
  }

  if (tokenAmount === undefined) {
    return null
  }

  const asOfLabel = asOf ? DateTime.fromJSDate(asOf).toRelative() : undefined
  const freshnessText = stale
    ? 'Price may be out of date'
    : asOfLabel
    ? `Quoted ${asOfLabel}`
    : undefined

  return (
    <div className={containerClass}>
      <div className={classes.amountText}>≈ {renderTokenFormatter.format(tokenAmount)} RENDER</div>
      {freshnessText && (
        <div className={stale ? `${classes.freshnessText} ${classes.staleText}` : classes.freshnessText}>
          {freshnessText}
        </div>
      )}
    </div>
  )
}

export const RenderPriceQuote = withStyles(styles)(_RenderPriceQuote)
