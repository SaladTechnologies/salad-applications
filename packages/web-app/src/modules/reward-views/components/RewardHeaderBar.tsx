import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { AddToCartButton } from '../../chopping-cart-views/components'
import { Reward } from '../../reward/models'
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
    padding: '2px 10px',
    fontSize: 8,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  outOfStockLabel: {
    color: theme.lightGreen,
    backgroundColor: theme.red,
  },
  lowQuanityLabel: {
    color: theme.darkBlue,
    backgroundColor: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onBack?: () => void
  onRedeem?: (reward?: Reward) => void
  isInCart?: boolean
  onAddToCart?: (reward: Reward) => void
  onRemoveFromCart?: (reward: Reward) => void
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
    const { reward, classes, ...rest } = this.props

    let donation = reward?.tags.some((x) => x.toLowerCase().startsWith('donation'))
    let outOfStock = reward?.quantity === 0
    let lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0

    //Flag indicating if this is a promo only game and cannot be redeemed
    let promoGame: boolean = reward ? reward?.price === 0 : false

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
              <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
                ${reward ? reward.price.toFixed(2) : '-'}
              </div>
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
            </div>
            <Button className={classes.buyButton} onClick={this.handleRedeem} disabled={outOfStock || promoGame}>
              <div className={classes.buyText}>{donation ? 'DONATE' : 'BUY'} NOW</div>
            </Button>
            <AddToCartButton reward={reward} {...rest} />
          </>
        )}
      </div>
    )
  }
}

export const RewardHeaderBar = withStyles(styles)(_RewardHeaderBar)
