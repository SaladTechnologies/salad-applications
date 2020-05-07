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
  sendStatus?: string
  emailAddress?: string
  goBack?: () => void
  resendVerification?: () => void
}

class _EmailVerificationPage extends Component<Props> {
  handleResend = () => {
    const { resendVerification } = this.props
    resendVerification?.()
  }

  handleGoBack = () => {
    const { goBack } = this.props
    goBack?.()
  }

  render() {
    const { emailAddress, sendStatus, classes } = this.props
    return (
      <div className={classes.container}>
        <img className={classes.logo} src={logo} alt="" />
        <div className={classNames(classes.text)}>
          <p>Verify it's you</p>
          <p className={classNames(classes.subTitle)}>
            {`We've sent a verification email${emailAddress ? ` to ${emailAddress}` : ''}`}
          </p>
          <p className={classNames(classes.subTitle)}>Please check your inbox and click the link to continue</p>
        </div>
        <div>
          <Button onClick={this.handleGoBack}>Go Back</Button>
          <Button onClick={this.handleResend}>Resend Verification Email</Button>
        </div>
        <div className={classes.statusText}>{sendStatus}</div>
      </div>
    )
  }
}

export const EmailVerificationPage = withStyles(styles)(_EmailVerificationPage)
