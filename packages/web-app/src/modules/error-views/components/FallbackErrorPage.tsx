import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { Button } from '../../../components/Button'
import { ErrorPage } from '../../../components/ErrorPage'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  buttons: {
    display: 'flex',
  },
  button: {
    color: 'red',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.darkBlue,
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  padding: {
    paddingBottom: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  alternativeMinerType: 'GPU' | 'CPU'
  currentMinerType: 'GPU' | 'CPU'
  onCloseClicked: () => void
  onOpenSupportTicket: () => void
  onSwitchMiningType: () => void
  onViewAVGuide: () => void
  gpuMiningEnabled: boolean
}

const forumLabel = 'Support Forum'

class _FallbackErrorPage extends Component<Props> {
  render() {
    const {
      alternativeMinerType,
      currentMinerType,
      onCloseClicked,
      onOpenSupportTicket,
      onSwitchMiningType,
      onViewAVGuide,
      classes,
    } = this.props
    return (
      <ErrorPage title={`Salad is Unable to Run on your ${currentMinerType}`} onCloseClicked={onCloseClicked}>
        <div className={classes.padding}>
          Salad is still unable to chop with your {currentMinerType}. This may be caused by your anti-virus program, but
          we'll show you how to{' '}
          <span className={classes.link} onClick={onViewAVGuide}>
            fix that issue here
          </span>
          .
        </div>
        <div className={classes.padding}>
          Already tried that? Try opening a{' '}
          <span className={classes.link} onClick={onOpenSupportTicket}>
            Support Ticket
          </span>{' '}
          or getting help from our{' '}
          <SmartLink to="https://forum.salad.io/c/community-support/6" trackingInfo={{ label: forumLabel }}>
            {forumLabel}
          </SmartLink>
          . In the meantime, try switching to {alternativeMinerType} mining so that you keep earning while we work to
          resolve your issue.
        </div>
        <Button className={classes.button} onClick={onSwitchMiningType}>
          <span className={classes.buttonText}>Switch to {alternativeMinerType} Mining</span>
        </Button>
      </ErrorPage>
    )
  }
}

export const FallbackErrorPage = withStyles(styles)(_FallbackErrorPage)
