import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Button } from '../../../components/Button'
import { ErrorPage } from '../../../components/ErrorPage'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  buttons: {
    display: 'flex',
  },
  button: {
    border: `solid 1px ${theme.darkBlue}`,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  buttonDark: {
    background: theme.darkBlue,
  },
  buttonText: {
    color: theme.darkBlue,
  },
  buttonTextLight: {
    color: theme.green,
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
  public override render(): ReactNode {
    const { currentEarningBonus, onCloseClicked, onReplaceCurrentBonus, classes } = this.props
    return (
      <ErrorPage title="Replace Current Earning Rate?" onCloseClicked={onCloseClicked}>
        <div className={classes.padding}>
          You currently have an earning rate of {currentEarningBonus}x, are you sure you want to replace it with a new
          bonus?
        </div>
        <div className={classes.buttons}>
          <Button className={classes.button} onClick={onReplaceCurrentBonus}>
            <span className={classes.buttonText}>Replace my current bonus</span>
          </Button>
          <Button className={classnames(classes.button, classes.buttonDark)} onClick={onCloseClicked}>
            <span className={classes.buttonTextLight}>Keep my current bonus</span>
          </Button>
        </div>
      </ErrorPage>
    )
  }
}

export const ReplaceBonusModal = withStyles(styles)(_ReplaceBonusModal)
