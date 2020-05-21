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
    border: '1px solid rgba(187, 187, 187, 1)',
    boxShadow: '0 0 10px rgba(187, 187, 187, 1)',
    color: 'white',
    height: '70vh',
    left: '50%',
    margin: 0,
    minHeight: 400,
    minWidth: 250,
    padding: 0,
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: '50vw',
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
  onLogout: () => void
  onResendVerificationEmail: () => void
  status?: string
}

export const EmailVerificationPage = withStyles(styles)(
  class EmailVerificationPage extends Component<Props> {
    render() {
      return (
        <Portal>
          <Overlay onCloseRequested={this.props.onLogout} />
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
              <Button onClick={this.props.onLogout}>Logout</Button>
              <Button onClick={this.props.onResendVerificationEmail}>Resend Verification Email</Button>
            </div>
            {this.props.status !== undefined && (
              <div className={this.props.classes.statusText}>{this.props.status}</div>
            )}
          </div>
        </Portal>
      )
    }
  },
)
