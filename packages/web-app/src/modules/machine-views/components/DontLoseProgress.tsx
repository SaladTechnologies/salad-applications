import classNames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button } from '../../../components/Button'
import { ErrorPage } from '../../../components/ErrorPage'
import { SaladTheme } from '../../../SaladTheme'
import { formatDurationInMilitaryTime } from '../../../utils'

const styles = (theme: SaladTheme) => ({
  buttons: {
    display: 'flex',
  },
  button: {
    border: `solid 1px ${theme.darkBlue}`,
    padding: 0,
  },
  buttonDark: {
    background: theme.darkBlue,
  },
  buttonTextDark: {
    color: theme.darkBlue,
  },
  buttonTextLight: {
    color: theme.green,
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  padding: {
    paddingBottom: '1rem',
  },
  prepTime: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  prepTime: number
  onSubmitSupportTicket: () => void
  onCloseClicked: () => void
  onStopPrepping: () => void
}

export class _DontLoseProgressPage extends Component<Props> {
  render() {
    const { onSubmitSupportTicket, onCloseClicked, onStopPrepping, prepTime, classes } = this.props

    return (
      <ErrorPage title={"Don't Lose your Progress!"}>
        <div className={classNames(classes.padding, classes.prepTime)}>
          Prepping for: {formatDurationInMilitaryTime(prepTime)}
        </div>
        <div className={classes.padding}>
          The first time you run Salad, Prepping can take over 30 minutes to download different miners and get you the
          best earning rates. You won't see any balance until Prepping is complete.
        </div>
        <div className={classes.padding}>
          Stopping and starting over will reset the whole process, so we recommend you let Prepping finish! If it's
          taking more than 30 minutes,{' '}
          <span className={classes.link} onClick={onSubmitSupportTicket}>
            submit a support ticket
          </span>
          .
        </div>
        <div className={classes.buttons}>
          <Button className={classes.button} onClick={onStopPrepping}>
            <span className={classes.buttonTextDark}>Stop Prepping</span>
          </Button>
          <Button className={classNames(classes.button, classes.buttonDark)} onClick={onCloseClicked}>
            <span className={classes.buttonTextLight}>Continue Prepping</span>
          </Button>
        </div>
      </ErrorPage>
    )
  }
}

export const DontLoseProgressPage = withStyles(styles)(_DontLoseProgressPage)
