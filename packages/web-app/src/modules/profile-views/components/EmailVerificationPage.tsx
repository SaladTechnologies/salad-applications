import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import logo from '../assets/animated-logo-lg.gif'
import classNames from 'classnames'
import { SaladTheme } from '../../../SaladTheme'
import { Button } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '10vw',
  },
  text: {
    padding: '1rem',
    textAlign: 'center',
    color: theme.lightGreen,
    fontSize: theme.large,
    fontFamily: 'SharpGroteskLight25',
  },
  subTitle: {
    fontSize: theme.small,
  },
  statusText: {
    textAlign: 'center',
    color: theme.green,
    fontSize: theme.medium,
    fontFamily: 'SharpGroteskLight25',
  },
})

interface Props extends WithStyles<typeof styles> {
  resendVerification?: () => void
  sendStatus?: string
}

class _EmailVerificationPage extends Component<Props> {
  onResend = () => {
    const { resendVerification } = this.props

    if (resendVerification) {
      resendVerification()
    }
  }
  render() {
    const { sendStatus, classes } = this.props
    return (
      <div className={classes.container}>
        <img className={classes.logo} src={logo} alt="" />
        <div className={classNames(classes.text)}>
          <p>Verify it's you</p>
          <p className={classNames(classes.subTitle)}>
            We've sent you a verification email, please check your inbox and click the link to continue
          </p>
        </div>
        <Button onClick={this.onResend}>Resend Verification Email </Button>
        <div className={classes.statusText}>{sendStatus}</div>
      </div>
    )
  }
}

export const EmailVerificationPage = withStyles(styles)(_EmailVerificationPage)
