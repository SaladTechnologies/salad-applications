import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, Overlay, Portal } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import logo from '../assets/animated-logo-lg.gif'

const styles = (theme: SaladTheme) => ({
  actions: {
    textAlign: 'center',
  },
  container: {
    backgroundColor: theme.darkBlue,
    left: '50%',
    maxHeight: 462,
    minHeight: 100,
    padding: 30,
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: 516,
    // TODO: Remove z-indexes!!!
    zIndex: 9999999999,
  },
  logo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '2vw',
  },
  statusText: {
    textAlign: 'center',
    color: theme.green,
    fontSize: theme.medium,
    fontFamily: 'SharpGroteskLight25',
  },
  subTitle: {
    fontSize: theme.small,
  },
  text: {
    padding: '1rem',
    textAlign: 'center',
    color: theme.lightGreen,
    fontSize: theme.large,
    fontFamily: 'SharpGroteskLight25',
  },
})

interface Props extends WithStyles<typeof styles> {
  emailAddress?: string
  goBack?: () => void
  resendVerificationEmail?: () => void
  sendStatus?: string
}

export const EmailVerificationPage = withStyles(styles)(
  class EmailVerificationPage extends Component<Props> {
    handleGoBack = () => {
      this.props.goBack?.()
    }

    handleResendVerificationEmail = () => {
      this.props.resendVerificationEmail?.()
    }

    render() {
      return (
        <Portal>
          <Overlay onCloseRequested={this.handleGoBack} />
          <div className={this.props.classes.container}>
            <img className={this.props.classes.logo} src={logo} alt="" />
            <div className={this.props.classes.text}>
              <p>Verify it's you</p>
              <p className={this.props.classes.subTitle}>
                {this.props.emailAddress
                  ? `We sent a verification email to ${this.props.emailAddress}.`
                  : 'We sent you a verification email.'}
              </p>
              <p className={this.props.classes.subTitle}>Please check your inbox, and click the link to continue.</p>
            </div>
            <div className={this.props.classes.actions}>
              <Button onClick={this.handleGoBack}>Go Back</Button>
              <Button onClick={this.handleResendVerificationEmail}>Resend Verification Email</Button>
            </div>
            <div className={this.props.classes.statusText}>{this.props.sendStatus}</div>
          </div>
        </Portal>
      )
    }
  },
)
