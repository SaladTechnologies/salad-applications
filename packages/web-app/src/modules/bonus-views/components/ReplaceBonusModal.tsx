import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
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
  currentEarningBonus: number
  onCloseClicked: () => void
  onReplaceCurrentBonus: () => void
}

class _ReplaceBonusModal extends Component<Props> {
  render() {
    const { currentEarningBonus, onCloseClicked, onReplaceCurrentBonus, classes } = this.props
    return (
      <ErrorPage title="Replace Your Current Bonus?" onCloseClicked={onCloseClicked}>
        <div className={classes.padding}>
          You currently have a bonus rate of {currentEarningBonus}x. Are you sure you want to replace your current
          bonus?
        </div>
        <div className={classes.buttons}>
          <Button className={classes.button} onClick={onReplaceCurrentBonus}>
            <span className={classes.buttonText}>Replace</span>
          </Button>
          <Button className={classes.button} onClick={onCloseClicked}>
            <span className={classes.buttonText}>Cancel</span>
          </Button>
        </div>
      </ErrorPage>
    )
  }
}

export const ReplaceBonusModal = withStyles(styles)(_ReplaceBonusModal)
