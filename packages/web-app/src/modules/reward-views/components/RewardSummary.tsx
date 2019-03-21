import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '5.5rem',
    display: 'flex',
    position: 'relative',
    cursor: 'pointer',
    width: '475px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.2rem',
  },
  imageContainer: {
    display: 'inline-block',
    width: '120px',
    backgroundColor: (props: Props) => props.color || theme.green,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '22rem',
    padding: '1rem .5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
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
    fontSize: theme.xLarge,
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '-.25rem',
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
    const { name, price, redeemable, imageSrc, classes } = this.props
    return (
      <div className={classnames(classes.container)} onClick={this.handleClick}>
        {/* Image */}
        <AngledPanel className={classes.imageContainer} leftSide={'right'}>
          <img className={classes.image} src={imageSrc} draggable={false} />
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
