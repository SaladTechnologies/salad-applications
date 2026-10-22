import classNames from 'classnames'
import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SaladPayPage } from '.'
import type { SaladTheme } from '../../../SaladTheme'
import { SmartLink } from '../../../components'
import { currencyFormatter } from '../../../formatters'
import { coinbaseEmailAccountAnchor, rewardRequiresCoinbaseEmail } from '../../coinbase'
import { RenderPriceQuoteContainer } from '../../reward-views/components/RenderPriceQuote'
import type { Reward } from '../../reward/models'
import type { SaladPaymentRequestOptions } from '../../salad-pay/models'
import { rewardRequiresSolanaAddress, solanaWalletAccountAnchor } from '../../solana-wallet'
import { SaladPayCheckoutButton } from './SaladPayCheckoutButton'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    color: '#000000',
  },
  title: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    lineSpacing: 1.5,
    textTransform: 'uppercase',
  },
  itemList: {
    borderBottom: '1px solid',
  },
  item: {
    padding: '16.5px 0px',
    fontFamily: theme.fontGroteskBook19,
    fontSize: 18,
  },
  total: {
    fontFamily: theme.fontGroteskMedium25,
    fontSize: 18,
    padding: '20px 0px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftText: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  balanceRow: {
    paddingTop: 16,
  },
  balance: {
    fontFamily: theme.fontGroteskMedium25,
    fontSize: 18,
    color: theme.mediumGreen,
    paddingTop: 10,
  },
  missingBalance: {
    color: theme.red,
  },
  earnBalanceLink: {
    fontFamily: theme.fontGroteskBook25,
    letterSpacing: 1,
    fontSize: 8,
    color: theme.red,
    paddingTop: 4,
  },
  disclaimer: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 8,
    lineSpacing: 1.5,
    paddingTop: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  walletWarning: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.red,
    border: `1px solid ${theme.red}`,
    borderRadius: 4,
    padding: '10px 12px',
    marginTop: 16,
  },
  walletWarningLink: {
    color: theme.red,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  // Where a Coinbase reward will be sent, on the white checkout modal.
  coinbaseEmailNotice: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.darkBlue,
    border: `1px solid ${theme.darkBlue}`,
    borderRadius: 4,
    padding: '10px 12px',
    marginTop: 16,
    overflowWrap: 'anywhere',
  },
  coinbaseEmailNoticeEmail: {
    fontWeight: 'bold',
  },
})

interface Props extends WithStyles<typeof styles> {
  availableBalance?: number
  processing?: boolean
  request?: SaladPaymentRequestOptions
  reward?: Reward
  /** The Chef's saved Solana wallet address, if any. Used to warn before redeeming a wallet-required reward. */
  solanaWalletAddress?: string
  /** Whether the Solana wallet is still being loaded (suppresses the warning until we know). */
  isSolanaWalletLoading?: boolean
  /** Loads the Chef's Solana wallet so the missing-wallet warning can be evaluated. */
  loadSolanaWallet?: () => void
  /** The Chef's saved Coinbase email, if any. Used to block, or show the destination of, a Coinbase reward. */
  coinbaseEmail?: string
  /** Whether the Coinbase email is still being loaded (suppresses the warning until we know). */
  isCoinbaseEmailLoading?: boolean
  /** Whether loading the Coinbase email failed. */
  isCoinbaseEmailLoadError?: boolean
  /** Loads the Chef's Coinbase email so the missing-email warning can be evaluated. */
  loadCoinbaseEmail?: () => void
  onConfirm: () => void
  onCloseClick: () => void
  onAbort: () => void
}

const moneyFormat = (amount?: number): string => currencyFormatter.format(amount ?? 0)

const _SaladPayOrderSummaryPage: FC<Props> = ({
  classes,
  availableBalance,
  processing,
  request,
  reward,
  solanaWalletAddress,
  isSolanaWalletLoading,
  loadSolanaWallet,
  coinbaseEmail,
  isCoinbaseEmailLoading,
  isCoinbaseEmailLoadError,
  loadCoinbaseEmail,
  onConfirm,
  onCloseClick,
  onAbort,
}) => {
  const hasEnoughBalance =
    availableBalance !== undefined && request !== undefined && availableBalance >= request.total.amount

  // Hard-block checkout when redeeming a reward that needs a Solana wallet the Chef hasn't set yet: RENDER token
  // rewards are paid out on-chain, so without an address on file there is nowhere to send them.
  const missingRequiredWallet = rewardRequiresSolanaAddress(reward) && !isSolanaWalletLoading && !solanaWalletAddress

  // Hard-block checkout for a Coinbase reward until the Chef's Coinbase email is known: it is sent to that email, so
  // without one there is nowhere to send it. A Chef the feature isn't available to can't save one, so stays blocked.
  const requiresCoinbaseEmail = rewardRequiresCoinbaseEmail(reward)
  const missingCoinbaseEmail = requiresCoinbaseEmail && !isCoinbaseEmailLoading && !coinbaseEmail

  const canConfirm = hasEnoughBalance && !missingRequiredWallet && !missingCoinbaseEmail

  const handleConfirmClick = () => {
    if (canConfirm) {
      onConfirm()
    }
  }

  useEffect(() => {
    if (rewardRequiresSolanaAddress(reward)) {
      loadSolanaWallet?.()
    }
    // Re-evaluate only when the reward changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSolanaWallet, reward?.id])

  useEffect(() => {
    if (rewardRequiresCoinbaseEmail(reward)) {
      loadCoinbaseEmail?.()
    }
    // Re-evaluate only when the reward changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCoinbaseEmail, reward?.id])

  useEffect(() => {
    window.addEventListener('popstate', onAbort)
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', onAbort)
      })
    }
  }, [onAbort])

  return (
    <>
      {!request ? (
        <SaladPayPage onClose={onCloseClick}>
          <div className={classes.title}>No Order Found</div>
        </SaladPayPage>
      ) : (
        <SaladPayPage onClose={onCloseClick}>
          <div className={classes.container}>
            <div className={classes.title}>ORDER SUMMARY</div>
            {request.displayItems && (
              <div className={classes.itemList}>
                {request.displayItems.map((x, i) => (
                  <div key={i} className={classNames(classes.row, classes.item)}>
                    <div className={classes.leftText}>{x.label}</div>
                    <div>{moneyFormat(x.amount)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className={classNames(classes.row, classes.total)}>
              <div className={classes.leftText}>{request.total.label}</div>
              <div>{moneyFormat(request.total.amount)}</div>
            </div>
            <RenderPriceQuoteContainer reward={reward} saladBalance={request.total.amount} variant="checkout" />
            {missingRequiredWallet && (
              <div className={classes.walletWarning}>
                You can't redeem this reward yet. RENDER token rewards are sent on-chain, so you must{' '}
                <SmartLink className={classes.walletWarningLink} to={solanaWalletAccountAnchor}>
                  add your Solana wallet address
                </SmartLink>{' '}
                before redeeming.
              </div>
            )}
            {missingCoinbaseEmail && (
              <div className={classes.walletWarning}>
                {isCoinbaseEmailLoadError ? (
                  <>
                    We couldn't load your Coinbase email, so you can't redeem this reward right now.{' '}
                    <SmartLink className={classes.walletWarningLink} to={coinbaseEmailAccountAnchor}>
                      Check your Coinbase email
                    </SmartLink>{' '}
                    and try again.
                  </>
                ) : (
                  <>
                    You can't redeem this reward yet. It is sent to your Coinbase account, so you must{' '}
                    <SmartLink className={classes.walletWarningLink} to={coinbaseEmailAccountAnchor}>
                      add your Coinbase email
                    </SmartLink>{' '}
                    before redeeming.
                  </>
                )}
              </div>
            )}
            {requiresCoinbaseEmail && coinbaseEmail && (
              <div className={classes.coinbaseEmailNotice}>
                This reward will be sent to the Coinbase account for{' '}
                <span className={classes.coinbaseEmailNoticeEmail}>{coinbaseEmail}</span>. Make sure this is your own
                Coinbase account. Salad cannot recover, reverse or refund rewards sent to a wrong email.{' '}
                <SmartLink to={coinbaseEmailAccountAnchor}>Change it</SmartLink>
              </div>
            )}
            <div className={classNames(classes.row, classes.balanceRow)}>
              <div className={classes.leftText}>
                <div className={classes.title}>Available Balance</div>
                <div
                  className={classNames(classes.balance, {
                    [classes.missingBalance]: !hasEnoughBalance,
                  })}
                >
                  {moneyFormat(availableBalance)}
                </div>
                {!hasEnoughBalance && (
                  <div className={classes.earnBalanceLink}>
                    <SmartLink to="/earn/summary">Earn More Balance</SmartLink>
                  </div>
                )}
              </div>
              <div>
                <SaladPayCheckoutButton onClick={handleConfirmClick} loading={processing} enabled={canConfirm} />
                <div className={classes.disclaimer}>Salad Plays for Keeps, No Refunds</div>
              </div>
            </div>
          </div>
        </SaladPayPage>
      )}
    </>
  )
}

export const SaladPayOrderSummaryPage = withStyles(styles)(_SaladPayOrderSummaryPage)
