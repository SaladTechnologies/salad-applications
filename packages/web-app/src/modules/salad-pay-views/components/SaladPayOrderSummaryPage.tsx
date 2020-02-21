import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { SaladPaymentRequestOptions } from '../../salad-pay/models'
import classNames from 'classnames'
import { SaladPayPage } from '.'

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
  button: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    backgroundColor: theme.mediumGreen,
    color: theme.lightGreen,
    textTransform: 'uppercase',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 218,
    height: 70,
  },
  enabledButton: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.green,
    },
  },
  disabledButton: {
    cursor: 'not-allowed',
  },
})

interface Props extends WithStyles<typeof styles> {
  request?: SaladPaymentRequestOptions
  availableBalance?: number
  onConfirm?: () => void
  onClose?: () => void
}

const moneyFormat = (amount?: number): string => {
  if (amount === undefined) return '$0.00'
  return `$${amount?.toFixed(2)}`
}

class _SaladPayOrderSummaryPage extends Component<Props> {
  hasBalance = (): boolean => {
    const { request, availableBalance } = this.props

    return availableBalance !== undefined && request !== undefined && availableBalance >= request.total.amount
  }

  handleConfirm = () => {
    const { onConfirm } = this.props

    if (onConfirm && this.hasBalance()) {
      onConfirm()
    }
  }

  render() {
    const { request, availableBalance, onClose, classes } = this.props

    if (!request) {
      return (
        <SaladPayPage onClose={onClose}>
          <div className={classes.title}>No Order Found</div>
        </SaladPayPage>
      )
    }

    //Does the user have enough balance
    let hasBalance = this.hasBalance()

    return (
      <SaladPayPage onClose={onClose}>
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
                  [classes.missingBalance]: !hasBalance,
                })}
              >
                {moneyFormat(availableBalance)}
              </div>
            </div>
            <div
              className={classNames(classes.button, {
                [classes.enabledButton]: hasBalance,
                [classes.disabledButton]: !hasBalance,
              })}
              onClick={this.handleConfirm}
            >
              Pay With Salad
            </div>
          </div>
        </div>
      </SaladPayPage>
    )
  }
}

export const SaladPayOrderSummaryPage = withStyles(styles)(_SaladPayOrderSummaryPage)
