import classnames from 'classnames'
import type { FunctionComponent } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button } from '../../../components/Button'
import { ErrorPage } from '../../../components/ErrorPage'
import { SaladTheme } from '../../../SaladTheme'

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
  onCloseClicked: () => void
  onOverride: () => void
}

const _OverrideCompatibilityDetection: FunctionComponent<Props> = ({ onCloseClicked, onOverride, classes }) => {
  return (
    <ErrorPage
      title="You're about to Override Compatibility Detection"
      onCloseClicked={onCloseClicked}
      modalWidth={510}
    >
      <div className={classes.padding}>
        If Salad is incorrectly detecting your hardware, you can enable compatibility detection. Warning: doing this
        will cause Salad to try each miner until it finds once that successfully chops on your machine, this may lead to
        a longer Prepping time.
      </div>
      <div className={classes.buttons}>
        <Button className={classes.button} onClick={onCloseClicked}>
          <span className={classes.buttonText}>Don't override</span>
        </Button>
        <Button className={classnames(classes.button, classes.buttonDark)} onClick={onOverride}>
          <span className={classes.buttonTextLight}>Override Compatibility Detection</span>
        </Button>
      </div>
    </ErrorPage>
  )
}

export const OverrideCompatibilityDetection = withStyles(styles)(_OverrideCompatibilityDetection)
