import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Img from 'react-image'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import { RewardMissingImage } from './RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'relative',
    flexShrink: 0,
    margin: '0 6px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  image: {
    height: 'auto',
    width: '100%',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
  },
  missingImageContainer: {
    position: 'relative',
    backgroundColor: theme.green,
    zIndex: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingImageText: {
    position: 'absolute',
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    textAlign: 'center',
  },
  textContainer: {
    padding: '0 10px',
  },
  subTextContainer: {
    display: 'flex',
  },
  nameText: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 24,
    letterSpacing: 0.5,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
  },
  outOfStockPrice: {
    textDecoration: 'line-through',
    color: theme.red,
  },
  stockLabel: {
    marginLeft: 8,
    padding: '1px 10px',
    fontSize: 8,
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
  onViewReward?: (reward?: Reward) => void
}

class _RewardItem extends Component<Props> {
  handleViewReward = () => {
    const { onViewReward, reward } = this.props

    if (onViewReward) {
      onViewReward(reward)
    }
  }

  render() {
    const { reward, classes } = this.props
    let outOfStock = reward?.quantity === 0
    let lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0
    return (
      <div key={reward?.id} className={classnames(classes.container)} onClick={this.handleViewReward}>
        <Img
          className={classes.image}
          src={reward?.coverImage}
          draggable={false}
          alt=""
          unloader={<RewardMissingImage text={reward?.name} />}
        />
        <div className={classes.textContainer}>
          <div className={classes.nameText}>{reward ? reward.name : 'Unknown'}</div>
          <div className={classes.subTextContainer}>
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
        </div>
      </div>
    )
  }
}

export const RewardItem = withStyles(styles)(_RewardItem)
