import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel, AngleDirection } from '../../../components/AngledPanel'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '5.5rem',
    display: 'flex',
    position: 'relative',
    cursor: 'pointer',
    width: '475px',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.2rem',
  },
  imageContainer: {
    display: 'inline-block',
    width: '120px',
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '22rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-block',
  },
  redeemable: {
    backgroundColor: theme.lightGreen,
    color: theme.blueFont,
  },
  notRedeemable: {
    backgroundColor: theme.darkGreen,
    color: theme.lightGreen,
  },
  nameText: {
    fontSize: theme.xLarge,
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '-.5rem',
  },
  priceText: {
    fontSize: theme.small,
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
  },
})

interface Props extends WithStyles<typeof styles> {
  name?: string
  price?: number
  redeemable?: boolean
  timeRemaining?: string
  imageSrc?: string
  color?: string
  onClick?: () => void
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
    const { name, color, price, redeemable, imageSrc, classes } = this.props

    return (
      <div className={classnames(classes.container, 'is-unselectable')} onClick={this.handleClick}>
        {/* Image */}
        <AngledPanel
          style={{ backgroundColor: color }}
          className={classes.imageContainer}
          leftSide={AngleDirection.Right}
        >
          <img className={classes.image} src={imageSrc} />
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
          <div className={classnames(classes.nameText)}>{name}</div>
        </div>
      </div>
    )
  }
}

export const RewardSummary = withStyles(styles)(_RewardSummary)
