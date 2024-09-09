import classNames from 'classnames'
import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SaladPayPage } from '.'
import type { SaladTheme } from '../../../SaladTheme'
import { SmartLink } from '../../../components'
import { currencyFormatter } from '../../../formatters'
import type { SaladPaymentRequestOptions } from '../../salad-pay/models'
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
})

interface Props extends WithStyles<typeof styles> {
  availableBalance?: number
  processing?: boolean
  request?: SaladPaymentRequestOptions
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
  onConfirm,
  onCloseClick,
  onAbort,
}) => {
  const hasEnoughBalance =
    availableBalance !== undefined && request !== undefined && availableBalance >= request.total.amount

  const handleConfirmClick = () => {
    if (hasEnoughBalance) {
      onConfirm()
    }
  }

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
                <SaladPayCheckoutButton onClick={handleConfirmClick} loading={processing} enabled={hasEnoughBalance} />
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
