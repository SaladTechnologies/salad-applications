import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { P, Username } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 1,
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 40px 10px',
    flex: 1,
    maxWidth: 300,
    minHeight: 300,
    color: theme.lightGreen,
    border: `1px solid ${theme.lightGreen}`,
    background:
      'linear-gradient(100deg, rgba(41, 105, 45, 0.6) -29%, rgba(41, 105, 45, 0.48) 20%, rgba(83, 166, 38, 0.6) 50%, rgba(51, 130, 56, 0.6) 88%)',
  },
  buttonContainer: {
    display: 'flex',
  },

  button: {
    fontFamily: theme.fontGroteskLight25,
    textAlign: 'center',
    letterSpacing: '1.3px',
    minWidth: 100,
    margin: 5,
    fontSize: 12,
    padding: '10px 20px',
    border: `1px solid ${theme.lightGreen}`,
    cursor: 'pointer',
    textTransform: 'uppercase',
    background:
      'linear-gradient(303.31deg, rgba(83, 166, 38, 0.3) -2.7%, rgba(178, 213, 48, 0.24) 48.55%, rgba(83, 166, 38, 0.3) 95.11%)',
    boxShadow: 'inset 3px 3px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  authenticated: boolean
  canLogin: boolean
  onLogin: () => void
  onRegister: () => void
  text?: string
}

class _LoginPanel extends Component<Props> {
  handleLogin = () => {
    const { canLogin, onLogin } = this.props
    if (canLogin) {
      onLogin()
    }
  }

  handleRegister = () => {
    const { canLogin, onRegister } = this.props
    if (canLogin) {
      onRegister()
    }
  }

  render() {
    const { authenticated } = this.props
    if (authenticated) {
      return null
    }

    const { canLogin, text, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <Username>Login Required</Username>
          <P>This page requires you to be logged in. Register or login now to start using Salad.</P>
          {text && <P>{text}</P>}
          <div className={classes.buttonContainer}>
            <div className={classes.button} onClick={canLogin ? this.handleLogin : undefined}>
              Login
            </div>
            {/*
              TODO: Add back in once we can open directly to the register page
              <div className={classes.button} onClick={canLogin ? this.handleRegister : undefined}>
                Register
              </div>
            */}
          </div>
        </div>
      </div>
    )
  }
}

export const LoginPanel = withStyles(styles)(_LoginPanel)
