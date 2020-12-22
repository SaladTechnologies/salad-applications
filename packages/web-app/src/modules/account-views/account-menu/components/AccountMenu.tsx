import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { formatBalance } from '../../../../utils'
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
    color: theme.lightGreen,
    minWidth: 80,
    textAlign: 'center',
    background:
      'linear-gradient(303.31deg, rgba(83, 166, 38, 0.3) -2.7%, rgba(178, 213, 48, 0.24) 48.55%, rgba(83, 166, 38, 0.3) 95.11%)',
    boxShadow: 'inset 3px 3px 4px rgba(0, 0, 0, 0.25)',
    fontFamily: theme.fontGroteskLight25,
    letterSpacing: '1.3px',
    fontSize: 12,
    padding: '4px 30px',
    border: `1px solid ${theme.lightGreen}`,
    cursor: 'pointer',
    textTransform: 'uppercase',
    marginLeft: 10,
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  authenticated: boolean
  canLogin: boolean
  currentBalance?: number
  onClick: () => void
  onLogin: () => void
  username?: string
}

class _AccountMenu extends Component<Props> {
  handleClick = () => {
    const { authenticated, canLogin, onLogin, onClick } = this.props
    if (authenticated) {
      onClick()
    } else if (canLogin) {
      onLogin()
    }
  }

  render() {
    const { authenticated, canLogin, classes, currentBalance, username } = this.props
    if (authenticated) {
      return (
        <>
          <div id="account-menu" className={classes.container} onClick={this.handleClick}>
            <div className={classes.username}>{username}</div>
            {currentBalance !== undefined && <div className={classes.balance}>{formatBalance(currentBalance)}</div>}
          </div>
          <ChoppingCartButtonContainer />
        </>
      )
    } else {
      return (
        <div className={classes.container}>
          <div
            id="account-menu-signin"
            className={classes.signUpButton}
            onClick={canLogin ? this.handleClick : undefined}
          >
            Login
          </div>
          {/*
            TODO: Add back in once we can open directly to the register page
            <div className={classes.signUpButton} onClick={canLogin ? this.handleClick : undefined}>
              Register
            </div>
          */}
        </div>
      )
    }
  }
}

export const AccountMenu = withStyles(styles)(_AccountMenu)
