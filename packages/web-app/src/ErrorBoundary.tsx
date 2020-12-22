import * as Sentry from '@sentry/react'
import { FC, PureComponent } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button } from './components/Button'
import { SmartLink } from './components/SmartLink'
import { SaladTheme } from './SaladTheme'

const styles = (theme: SaladTheme) => ({
  actionBar: {
    textAlign: 'center',
  },
  crashReportAction: {
    backgroundColor: theme.darkBlue,
    color: theme.green,
    cursor: 'pointer',
  },
  modal: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    padding: '1rem 0.5rem',
    userSelect: 'none',
    width: '50vmin',
  },
  page: {
    alignItems: 'center',
    backgroundColor: theme.darkBlue,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface ErrorProps extends WithStyles<typeof styles> {
  error: Error | null
  eventId: string | null
}

interface ErrorState {
  canShowReportDialog: boolean
  reportDialogShown: boolean
}

class ErrorPage extends PureComponent<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props)
    this.state = {
      canShowReportDialog: props.eventId != null,
      reportDialogShown: false,
    }
  }

  handleShowReportDialog = () => {
    if (this.props.eventId == null || !this.state.canShowReportDialog || this.state.reportDialogShown) {
      return
    }

    Sentry.showReportDialog({
      eventId: this.props.eventId,
      labelClose: 'Close',
      labelComments: 'What Happened?',
      labelEmail: 'Salad Email',
      labelName: 'Name',
      labelSubmit: 'Submit Crash Report',
      onLoad: () => {
        this.setState(() => ({
          canShowReportDialog: false,
        }))
      },
      subtitle: 'Our engineers are already on the case, but they could use your help. Submit a report below.',
      subtitle2: '',
      successMessage: "Thanks for the assist chef, we're working on a solution now.",
      title: "There's Some Gunk In the Kitchen",
    })
    this.setState(() => ({
      reportDialogShown: true,
    }))
  }

  render() {
    return (
      <div className={this.props.classes.page}>
        <div className={this.props.classes.modal}>
          <div className={this.props.classes.title}>There's Trouble in the Kitchen!</div>
          <div className={this.props.classes.description}>
            <p>
              Salad has encountered an unknown error and cannot continue. Please restart the app to try again. If you
              encounter further issues, please send us a crash report by clicking below and{' '}
              <SmartLink to="https://www.salad.io/support/">submit a support ticket</SmartLink>.
            </p>
            <p>
              If you'd like live help from both fellow chefs and Salad support representatives, feel free to drop by our{' '}
              <SmartLink to="https://discord.gg/29Sgfq3">Discord</SmartLink> and post your error in the support channel.
            </p>
            {!this.state.canShowReportDialog && this.state.reportDialogShown ? (
              <p>We appreciate the help, thanks for keeping Salad fresh!</p>
            ) : null}
          </div>
          {this.state.canShowReportDialog ? (
            <div className={this.props.classes.actionBar}>
              <Button className={this.props.classes.crashReportAction} onClick={this.handleShowReportDialog}>
                Send Crash Report
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const StyledErrorPage = withStyles(styles)(ErrorPage)

export const ErrorBoundary: FC = ({ children }) => (
  <Sentry.ErrorBoundary fallback={({ error, eventId }) => <StyledErrorPage error={error} eventId={eventId} />}>
    {children}
  </Sentry.ErrorBoundary>
)
