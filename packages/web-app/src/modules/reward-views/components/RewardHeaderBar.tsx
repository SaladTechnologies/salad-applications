import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import { Button } from '../../../components'
import { IconArrowLeft } from './assets'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6px 12px',
    borderBottom: `1px solid ${theme.green}`,
    color: theme.lightGreen,
  },
  backButton: {
    height: '100%',
    width: 15,
    paddingRight: 20,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.5,
    },
  },
  nameText: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 36,
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
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onBack?: () => void
  onRedeem?: (reward?: Reward) => void
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
    const { reward, classes } = this.props
    return (
      <div className={classnames(classes.container)} onClick={this.handleBack}>
        <div className={classes.backButton}>
          <IconArrowLeft />
        </div>
        <div className={classes.nameText}>{reward && reward.name ? reward.name : 'Unknown'}</div>
        <div className={classes.priceText}>${reward ? reward.price.toFixed(2) : '-'}</div>
        <Button onClick={this.handleRedeem}>BUY NOW</Button>
      </div>
    )
  }
}

export const RewardHeaderBar = withStyles(styles)(_RewardHeaderBar)
