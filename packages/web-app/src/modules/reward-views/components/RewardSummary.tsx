import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '60px',
    flex: '0 0',
    display: 'flex',
    position: 'relative',
    cursor: 'pointer',
    width: '360px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.2rem',
    height: '8px',
  },
  imageContainer: {
    display: 'inline-block',
    width: '82px',
    backgroundColor: (props: Props) => props.color || 'transparent',
  },
  image: {
    height: '100%',
    width: '82px',
  },
  rightContainer: {
    width: '22rem',
    padding: '6px',
    overflow: 'hidden',
    marginLeft: '2.67px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  redeemable: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
  },
  notRedeemable: {
    backgroundColor: theme.darkGreen,
    color: theme.green,
  },
  nameText: {
    fontSize: '36px',
    lineHeight: '36px',
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '.25rem',
  },
  priceText: {
    fontSize: '8px',
    lineHeight: '6px',
    letterSpacing: '1px',
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
    textTransform: 'uppercase',
  },
  outOfStock: {
    textTransform: 'uppercase',
    position: 'absolute',
    height: '6px',
    right: '-0.5px',
    bottom: '0px',
    fontFamily: theme.fontGroteskLight25,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: '8px',
    lineHeight: '6px',
    backgroundColor: theme.red,
    padding: '5px',
    paddingLeft: '12.5px',
    verticalAlign: 'middle',
    textAlign: 'center',
    letterSpacing: '1.14px',
    color: theme.darkBlue,
  },
  lowStock: {
    textTransform: 'uppercase',
    position: 'absolute',
    height: '6px',
    right: '-0.5px',
    bottom: '0px',
    fontFamily: theme.fontGroteskLight25,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: '8px',
    lineHeight: '6px',
    backgroundColor: theme.orange,
    padding: '5px',
    paddingLeft: '12.5px',
    verticalAlign: 'middle',
    textAlign: 'center',
    letterSpacing: '1.14px',
    color: theme.darkBlue,
  },
})

interface Props extends WithStyles<typeof styles> {
  name?: string
  price?: number
  redeemable?: boolean
  timeRemaining?: string
  image?: string
  color?: string
  onClick?: () => void
  quantity?: number
}

class _RewardSummary extends Component<Props> {
  timeRemainingText() {
    const { redeemable, timeRemaining } = this.props

    if (redeemable) {
      return '  |  Redeemable'
    }

    if (timeRemaining) {
      return `  |  ${timeRemaining}`
    }

    return ''
  }

  handleClick = () => {
    const { onClick } = this.props
    if (onClick != null) {
      onClick()
    }
  }
  render() {
    const { name, price, redeemable, image, classes, quantity } = this.props
    return (
      <div className={classnames(classes.container)} onClick={this.handleClick}>
        {/* Image */}
        <AngledPanel className={classes.imageContainer} leftSide={'right'}>
          <img className={classes.image} src={image} draggable={false} alt="" />
        </AngledPanel>

        {/* Right side panel */}
        <div
          className={classnames(classes.rightContainer, {
            [classes.redeemable]: redeemable,
            [classes.notRedeemable]: !redeemable,
          })}
        >
          {/* Padlock */}
          <div className={classes.lock}>
            {redeemable && <FontAwesomeIcon size="sm" icon={faLockOpen} />}
            {!redeemable && <FontAwesomeIcon size="sm" icon={faLock} />}
          </div>

          <div className={classnames(classes.priceText)}>
            ${price ? price.toFixed(2) : '0.00'} {this.timeRemainingText()}
          </div>
          <div>
            <div className={classnames(classes.nameText)}>{name}</div>
            {quantity === 0 && (
              <AngledPanel leftSide={'right'} className={classnames(classes.outOfStock)}>
                OUT OF STOCK
              </AngledPanel>
            )}
            {quantity !== null && quantity !== 0 && (
              <AngledPanel leftSide={'right'} className={classnames(classes.lowStock)}>
                {quantity} REMAINING
              </AngledPanel>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export const RewardSummary = withStyles(styles)(_RewardSummary)
