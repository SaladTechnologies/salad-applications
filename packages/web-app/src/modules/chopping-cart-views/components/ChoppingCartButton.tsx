import * as React from 'react'
import type { ReactNode } from 'react'
import { Component } from 'react'
import ReactHintFactory from 'react-hint'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ChoppingCartTooltip } from '.'
import type { SaladTheme } from '../../../SaladTheme'
import type { Reward } from '../../reward/models'
import { CartIcon } from '../assets/cart-icon'

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
  onClickChoppingCartIcon: () => void
}

class _ChoppingCartButton extends Component<Props> {
  public override render(): ReactNode {
    const { onClickChoppingCartIcon, rewards, classes } = this.props

    return (
      <>
        <ReactHint
          position={'bottom'}
          events
          delay={{ show: 0, hide: 300 }}
          attribute="data-chopping-cart-button"
          onRenderContent={() => <ChoppingCartTooltip rewards={rewards} />}
        />
        <div className={classes.container} data-chopping-cart-button onClick={onClickChoppingCartIcon}>
          {rewards && rewards.length !== 0 && <div className={classes.notificationDot}>{rewards.length}</div>}
          <CartIcon />
        </div>
      </>
    )
  }
}

export const ChoppingCartButton = withStyles(styles)(_ChoppingCartButton)
