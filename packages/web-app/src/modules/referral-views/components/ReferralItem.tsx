import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { currencyFormatter } from '../../../Formatters'
import { AngledPanel } from '../../../components'
import classnames from 'classnames'

const borderWidth = 1

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    color: theme.lightGreen,
    userSelect: 'none',
    padding: '.25rem 0rem',
  },
  borderPanel: {
    backgroundColor: theme.lightGreen,
    position: 'relative',
    width: '16rem',
    height: '3.5rem',
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  innerPanel: {
    position: 'absolute',
    top: borderWidth,
    bottom: borderWidth,
    right: borderWidth,
    left: borderWidth * 2,
    backgroundColor: theme.darkBlue,
    paddingLeft: '2rem',
    paddingRight: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

interface Props extends WithStyles<typeof styles> {
  key?: string
  username?: string
  status?: string
  balanceReward?: number
  onClick?: () => void
}

class _ReferralItem extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props

    if (onClick) onClick()
  }
  render() {
    const { key, onClick, username, status, balanceReward, classes } = this.props
    return (
      <div
        key={key}
        className={classnames(classes.container, { [classes.clickable]: onClick !== undefined })}
        onClick={this.handleClick}
      >
        <AngledPanel className={classes.borderPanel} leftSide="right">
          <AngledPanel className={classes.innerPanel} leftSide="right">
            <div>{username}</div>
            <div>{status}</div>
            {balanceReward !== undefined && <div>Reward: {currencyFormatter.format(balanceReward || 0)}</div>}
          </AngledPanel>
        </AngledPanel>
      </div>
    )
  }
}

export const ReferralItem = withStyles(styles)(_ReferralItem)
