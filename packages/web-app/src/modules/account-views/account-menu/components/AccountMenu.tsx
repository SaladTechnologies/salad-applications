import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { ChoppingCartButtonContainer } from '../../../chopping-cart-views'

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
  signUpButton: {
    color: theme.darkBlue,
    backgroundColor: theme.green,
    fontFamily: theme.fontGroteskLight25,
    letterSpacing: '1.3px',
    fontSize: 12,
    padding: '4px 30px',
    border: `1px solid ${theme.lightGreen}`,
    cursor: 'pointer',
    textTransform: 'uppercase',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  authenticated?: boolean
  username?: string
  currentBalance?: number
  onClick?: () => void
  onLogin?: () => void
}

class _AccountMenu extends Component<Props> {
  handleClick = () => {
    const { authenticated, onLogin, onClick } = this.props

    if (authenticated) {
      onClick?.()
    } else {
      onLogin?.()
    }
  }

  render() {
    const { authenticated, username, currentBalance, classes } = this.props

    if (authenticated) {
      return (
        <>
          <div className={classes.container} onClick={this.handleClick}>
            <div className={classes.username}>{username}</div>
            {currentBalance !== undefined && <div className={classes.balance}>{`$${currentBalance.toFixed(2)}`}</div>}
          </div>
          <ChoppingCartButtonContainer />
        </>
      )
    }
    return (
      <div className={classes.signUpButton} onClick={this.handleClick}>
        Sign Up
      </div>
    )
  }
}

export const AccountMenu = withStyles(styles)(_AccountMenu)
