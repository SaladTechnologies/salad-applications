import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    '-webkit-app-region': 'none',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    maxWidth: 320,
    color: theme.green,
    '&:hover': {
      color: theme.lightGreen,
    },
  },
  username: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: 12,
    letterSpacing: '1.3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  balance: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    marginLeft: 10,
    letterSpacing: 1.5,
  },
})

interface Props extends WithStyles<typeof styles> {
  username?: string
  currentBalance?: number
  onClick?: () => void
}

class _AccountMenu extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props

    onClick?.()
  }
  render() {
    const { username, currentBalance, classes } = this.props

    return (
      <div className={classes.container} onClick={this.handleClick}>
        <div className={classes.username}>{username}</div>
        {currentBalance !== undefined && <div className={classes.balance}>{`$${currentBalance.toFixed(2)}`}</div>}
      </div>
    )
  }
}

export const AccountMenu = withStyles(styles)(_AccountMenu)
