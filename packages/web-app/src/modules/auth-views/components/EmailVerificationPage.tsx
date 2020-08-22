import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, Overlay, Portal } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { TooManyRequestsError } from '../../auth/TooManyRequestsError'
import logo from '../assets/animated-logo-lg.gif'

const styles = (theme: SaladTheme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.darkBlue,
    border: '1px solid rgba(187, 187, 187, 1)',
    boxShadow: '0 0 10px rgba(187, 187, 187, 1)',
    color: 'white',
    display: 'flex',
    fontFamily: 'SharpGroteskLight25',
    height: '70vh',
    justifyContent: 'center',
    left: '50%',
    margin: 0,
    minHeight: 400,
    minWidth: 250,
    padding: 0,
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: '50vw',
    // TODO: Remove z-indexes!!!
    zIndex: 9999999999,
  },
  message: {
    color: theme.green,
    fontSize: theme.medium,
  },
  space: {
    marginTop: '2em',
  },
  spinner: {
    width: '2vw',
    zIndex: 99999999999,
  },
  text: {
    color: theme.lightGreen,
    fontSize: theme.small,
  },
  title: {
    fontSize: theme.large,
  },
})

interface EmailVerificationProps extends WithStyles<typeof styles> {
  canLogin: boolean
  canResendVerificationEmail: boolean
  emailAddress?: string
  onCheckEmailVerification: () => Promise<boolean>
  onCloseRequested: () => void
  onEmailVerificationComplete: () => Promise<void>
  onResendVerificationEmail: () => Promise<void>
}

interface EmailVerificationState {
  disableResendVerificationEmail: boolean
  message: string | undefined
}

export const EmailVerificationPage = withStyles(styles)(
  class EmailVerificationPage extends Component<EmailVerificationProps, EmailVerificationState> {
    private closed: boolean
    private pollAuth0Interval?: NodeJS.Timeout
    private retryAfterTimeout?: NodeJS.Timeout

    constructor(props: EmailVerificationProps) {
      super(props)
      this.closed = false
      this.state = {
        disableResendVerificationEmail: false,
        message: undefined,
      }
    }

    handleResendVerificationEmail = () => {
      if (this.state.disableResendVerificationEmail) {
        return
      }

      if (this.retryAfterTimeout !== undefined) {
        clearTimeout(this.retryAfterTimeout)
      }

      this.setState(
        {
          disableResendVerificationEmail: true,
          message: undefined,
        },
        () => {
          this.props
            .onResendVerificationEmail()
            .then(() => {
              if (this.closed) {
                return
              }

              this.setState(
                {
                  message: 'Verification email sent.',
                },
                () => {
                  this.retryAfterTimeout = setTimeout(() => {
                    if (this.closed) {
                      return
                    }

                    this.setState({
                      disableResendVerificationEmail: false,
                    })
                  }, 60000)
                },
              )
            })
            .catch((error) => {
              if (error instanceof TooManyRequestsError) {
                this.setState(
                  {
                    message: error.message || 'Please wait before sending another verification email.',
                  },
                  () => {
                    this.retryAfterTimeout = setTimeout(() => {
                      if (this.closed) {
                        return
                      }

                      this.setState({
                        disableResendVerificationEmail: false,
                      })
                    }, (error.retryAfter || 60) * 1000)
                  },
                )
              } else {
                this.setState({
                  disableResendVerificationEmail: false,
                  message: (error as Error).message || 'Failed to send the verification email.',
                })
              }
            })
        },
      )
    }

    componentDidMount() {
      this.pollAuth0Interval = setInterval(() => {
        if (this.closed) {
          return
        }

        this.props.onCheckEmailVerification().then((result) => {
          if (this.closed) {
            return
          }

          if (result && this.props.canLogin) {
            if (this.pollAuth0Interval !== undefined) {
              clearInterval(this.pollAuth0Interval)
            }

            this.props.onEmailVerificationComplete().catch(() => {})
          }
        })
      }, 15000)
    }

    componentWillUnmount() {
      if (this.pollAuth0Interval !== undefined) {
        clearInterval(this.pollAuth0Interval)
      }

      if (this.retryAfterTimeout !== undefined) {
        clearTimeout(this.retryAfterTimeout)
      }

      this.closed = true
    }

    render() {
      return (
        <Portal>
          <Overlay onCloseRequested={this.props.onCloseRequested} />
          <div className={this.props.classes.container}>
            <div>
              <img alt="Verifying email..." className={this.props.classes.spinner} src={logo} />
              <div className={classNames(this.props.classes.text, this.props.classes.space)}>
                <p className={this.props.classes.title}>Verify it's you</p>
                <p>
                  {this.props.emailAddress
                    ? `We sent a verification email to ${this.props.emailAddress}.`
                    : 'We sent you a verification email.'}
                </p>
                <p>Please check your inbox and open the link to continue.</p>
              </div>
              <div className={this.props.classes.space}>
                {!this.props.canResendVerificationEmail ? null : (
                  <Button
                    onClick={this.handleResendVerificationEmail}
                    disabled={this.state.disableResendVerificationEmail}
                  >
                    Resend Verification Email
                  </Button>
                )}
                <Button onClick={this.props.onCloseRequested}>Cancel</Button>
              </div>
              <div className={classNames(this.props.classes.message, this.props.classes.space)}>
                {this.state.message === undefined ? '' : this.state.message}
              </div>
            </div>
          </div>
        </Portal>
      )
    }
  },
)
