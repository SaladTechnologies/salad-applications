import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { getPercentOff } from '../../reward/utils'
import { IconArrowLeft } from './assets'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6px 20px 6px 12px',
    borderBottom: `1px solid ${theme.lightGreen}`,
    color: theme.lightGreen,
    height: 87,
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.5,
    },
  },
  backButton: {
    width: 15,
    padding: 10,
  },
  nameText: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 42,
    letterSpacing: 0.5,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 14,
    letterSpacing: 1,
    marginRight: 10,
  },
  buyButton: {
    backgroundColor: theme.green,
    padding: '10px 30px',
  },
  buyText: {
    fontSize: 14,
    color: theme.darkBlue,
    fontWeight: 'bold',
  },
  outOfStockPrice: {
    textDecoration: 'line-through',
    color: theme.red,
  },
  stockLabel: {
    fontSize: 8,
    padding: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  outOfStockLabel: {
    padding: '2px 10px',
    color: theme.lightGreen,
    backgroundColor: theme.red,
  },
  insufficientBalanceLabel: {
    color: theme.red,
  },
  lowQuanityLabel: {
    color: theme.darkBlue,
    backgroundColor: theme.green,
  },
  discountLabel: {
    fontFamily: theme.fontGroteskBook19,
    color: theme.darkBlue,
    backgroundColor: theme.cyan,
    fontSize: 12,
    letterSpacing: 1,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 3,
    marginTop: 3,
  },
  originalPrice: {
    textDecoration: 'line-through',
    opacity: 0.5,
    color: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  currentBalance?: number
  authenticated?: boolean
  onBack?: () => void
  onRedeem?: (reward?: Reward) => void
  isInCart?: boolean
  onAddToCart?: (reward: Reward) => void
  onRemoveFromCart?: (reward: Reward) => void
  requiresMinecraftUsername: boolean
  requiresPayPalAccount: boolean
  requiresSaladCard: boolean
  trackDisabledBuyNowClick: () => void
}

class _RewardHeaderBar extends Component<Props> {
  handleRedeem = () => {
    const { reward, onRedeem } = this.props
    if (onRedeem) {
      onRedeem(reward)
    }
  }

  handleBack = () => {
    const { onBack } = this.props

    if (onBack) {
      onBack()
    }
  }

  render() {
    const {
      reward,
      authenticated,
      currentBalance,
      requiresMinecraftUsername,
      requiresPayPalAccount,
      requiresSaladCard,
      trackDisabledBuyNowClick,
      classes,
    } = this.props

    const balance = currentBalance || 0

    let donation = reward?.tags.some((x) => x.toLowerCase().startsWith('donation'))
    let outOfStock = reward?.quantity === 0
    let lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0

    //Flag indicating if this is a promo only game and cannot be redeemed
    const promoGame: boolean = reward ? reward?.price === 0 : false
    const hasBalance = reward ? reward?.price <= balance : false

    const disabled = outOfStock || promoGame || (authenticated && !hasBalance)

    return (
      <div className={classnames(classes.container)}>
        <div className={classes.nameContainer} onClick={this.handleBack}>
          <div className={classes.backButton}>
            <IconArrowLeft />
          </div>
          <div className={classes.nameText}>{reward && reward.name ? reward.name : ''}</div>
        </div>

        {!promoGame && (
          <>
            <div className={classes.priceContainer}>
              {reward && reward.originalPrice && !outOfStock ? (
                <div className={classes.priceText}>
                  <span className={classes.originalPrice}>${reward.originalPrice.toFixed(2)}</span> $
                  {reward.price.toFixed(2)}
                </div>
              ) : (
                <div
                  className={classnames(classes.priceText, {
                    [classes.outOfStockPrice]: hasBalance,
                    [classes.outOfStockPrice]: outOfStock,
                  })}
                >
                  ${reward ? reward.price.toFixed(2) : '-'}
                </div>
              )}
              {reward && reward.originalPrice && !outOfStock && (
                <div className={classnames(classes.discountLabel)}>
                  {getPercentOff(reward.originalPrice, reward.price)}{' '}
                </div>
              )}
              {outOfStock && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.outOfStockLabel)}>
                  Out of Stock
                </div>
              )}
              {lowQuanity && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.lowQuanityLabel)}>
                  {`${reward?.quantity} Remaining`}
                </div>
              )}
              {!hasBalance && authenticated && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.insufficientBalanceLabel)}>
                  <SmartLink to="/earn/summary">Earn More Balance</SmartLink>
                </div>
              )}
              {requiresMinecraftUsername && authenticated && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.insufficientBalanceLabel)}>
                  <SmartLink to="/account/summary">Add Minecraft Username</SmartLink>
                </div>
              )}
              {requiresPayPalAccount && authenticated && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.insufficientBalanceLabel)}>
                  <SmartLink to="/account/summary">Add PayPal account</SmartLink>
                </div>
              )}
              {requiresSaladCard && authenticated && (
                <div className={classnames(classes.priceText, classes.stockLabel, classes.insufficientBalanceLabel)}>
                  <SmartLink to="/earn/saladcard-enroll">Enroll in SaladCard</SmartLink>
                </div>
              )}
            </div>
            <Button
              className={classes.buyButton}
              onClick={this.handleRedeem}
              disabled={disabled}
              trackDisabledButtonClick={trackDisabledBuyNowClick}
            >
              <div className={classes.buyText}>{donation ? 'DONATE' : 'BUY'} NOW</div>
            </Button>
          </>
        )}
      </div>
    )
  }
}

export const RewardHeaderBar = withStyles(styles)(_RewardHeaderBar)
