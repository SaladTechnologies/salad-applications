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
  padding: {
    paddingBottom: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  alternativeMinerType: 'GPU' | 'CPU'
  currentMinerType: 'GPU' | 'CPU'
  onCloseClicked: () => void
  onOverride: () => void
  onSwitchMiningType: () => void
}

const specsLabel = 'these Specs'

export class _NotCompatibleErrorPage extends Component<Props> {
  render() {
    const {
      alternativeMinerType,
      currentMinerType,
      onCloseClicked,
      onOverride,
      onSwitchMiningType,
      classes,
    } = this.props

    return (
      <ErrorPage title={`Salad is Unable to Run on your ${currentMinerType}`} onCloseClicked={onCloseClicked}>
        <div className={classes.padding}>
          Salad was unable to detect a compatible {currentMinerType}, but don't worry - if you know your machine meets{' '}
          <SmartLink
            to="https://support.salad.io/hc/en-us/articles/360048320131-Is-My-Machine-Compatible-With-Salad"
            trackingInfo={{ label: 'These Specs' }}
          >
            {specsLabel}
          </SmartLink>
          , click 'Override Compatibility Detection'. Salad will attempt to download backup miners and still use your{' '}
          {currentMinerType}.
        </div>
        <div className={classes.padding}>
          If you know your {currentMinerType} isn't up to the challenge, you can always switch to {alternativeMinerType}{' '}
          mining.
        </div>
        <div className={classes.buttons}>
          <Button className={classes.button} onClick={onSwitchMiningType}>
            <span className={classes.buttonText}>Switch To {alternativeMinerType} Mining</span>
          </Button>
          <Button className={classes.button} onClick={onOverride}>
            <span className={classes.buttonText}>Override Compatibility Detection</span>
          </Button>
        </div>
      </ErrorPage>
    )
  }
}

export const NotCompatibleErrorPage = withStyles(styles)(_NotCompatibleErrorPage)
