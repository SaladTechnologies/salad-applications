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
  gpuMiningEnabled: boolean
}

class _FallbackErrorPage extends Component<Props> {
  render() {
    const {
      alternativeMinerType,
      currentMinerType,
      onCloseClicked,
      onOpenSupportTicket,
      onSwitchMiningType,
      classes,
    } = this.props
    return (
      <ErrorPage title={`Salad is Unable to Run on your ${currentMinerType}`} onCloseClicked={onCloseClicked}>
        <div className={classes.padding}>
          Salad is still unable to get chopping with your {currentMinerType}. We recommend{' '}
          <span className={classes.link} onClick={onOpenSupportTicket}>
            opening a Support Ticket
          </span>{' '}
          or getting help from our{' '}
          <SmartLink to="https://forum.salad.io/c/community-support/6">Support Forum</SmartLink>.
        </div>
        <div className={classes.padding}>
          In the meantime, try switching to {alternativeMinerType} mining so that you keep earning while we work to
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
