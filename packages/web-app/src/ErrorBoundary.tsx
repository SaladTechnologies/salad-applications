import type { FunctionComponent, ReactNode } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from './SaladTheme'
import { SmartLink } from './components'

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

interface ErrorPageProps extends FallbackProps, WithStyles<typeof styles> {}

const ErrorPage: FunctionComponent<ErrorPageProps> = ({ classes }) => (
  <div className={classes.page}>
    <div className={classes.modal}>
      <div className={classes.title}>There's Trouble in the Kitchen!</div>
      <div className={classes.description}>
        <p>
          Salad has encountered an unknown error and cannot continue. Please restart the app to try again. If you
          encounter further issues, please <SmartLink to="https://support.salad.com">submit a support ticket</SmartLink>
          .
        </p>
        <p>
          If you'd like to try to get live help from a fellow Chef, feel free to drop by our{' '}
          <SmartLink to="https://discord.gg/salad">Discord</SmartLink> and post your error in one of the community
          support channels.
        </p>
      </div>
    </div>
  </div>
)

const StyledErrorPage = withStyles(styles)(ErrorPage)

const ErrorBoundaryPage: FunctionComponent<{ children?: ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={StyledErrorPage}>{children}</ErrorBoundary>
)

export { ErrorBoundaryPage as ErrorBoundary }
