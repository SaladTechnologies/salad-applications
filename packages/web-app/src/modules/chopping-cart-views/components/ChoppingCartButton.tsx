import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { CartIcon } from '../assets/cart-icon'
import { Reward } from '../../reward/models'
// @ts-ignore
import ReactHintFactory from 'react-hint'
import { ChoppingCartTooltip } from '.'

const ReactHint = ReactHintFactory(React)

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    textTransform: 'uppercase',
    color: theme.lightGreen,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingRight: 15,
  },
  notificationDot: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: '50%',
    top: 1,
    left: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards?: Reward[]
  onViewReward?: (reward: Reward) => void
}

class _ChoppingCartButton extends Component<Props> {
  render() {
    const { rewards, onViewReward, classes } = this.props

    return (
      <>
        <ReactHint
          position={'bottom'}
          events
          delay={{ show: 0, hide: 300 }}
          attribute="data-chopping-cart-button"
          onRenderContent={() => <ChoppingCartTooltip rewards={rewards} onViewReward={onViewReward} />}
        />
        <div className={classes.container} data-chopping-cart-button>
          {rewards && rewards.length !== 0 && <div className={classes.notificationDot}>{rewards.length}</div>}
          <CartIcon />
          Chopping Cart
        </div>
      </>
    )
  }
}

export const ChoppingCartButton = withStyles(styles)(_ChoppingCartButton)
