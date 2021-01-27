import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { P, StatElement } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatDuration } from '../../../utils'
import { MiningStatus } from '../../machine/models'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 100,
    width: 200,
    margin: 20,
    display: 'flex',
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
  },
  buttonBorder: {
    background:
      'linear-gradient(-75deg, rgba(178, 213, 48, 0.5) 30%, rgba(175, 214, 28, 0.2) 50%, rgba(178, 213, 48, 0.70) 100%)',
    width: '100%',
    display: 'flex',
    padding: 2, //borderWidth
  },
  buttonBorderInner: {
    backgroundColor: theme.darkBlue,
    width: '100%',
    display: 'flex',
  },
  button: {
    background:
      'linear-gradient(75.49deg, rgba(201, 240, 55, 0.24) -16.36%, rgba(175, 214, 28, 0.64) 58.63%, rgba(178, 213, 48, 0.571429) 95.69%, rgba(178, 213, 48, 0.24) 153.04%)',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
    fontFamily: theme.fontGroteskBook25,
    fontSize: 18,
    textTransform: 'uppercase',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
  },
  disabledButton: {
    cursor: 'not-allowed',
    color: theme.darkBlue,
  },
  '@keyframes animated': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
  running: {
    color: theme.lightGreen,
    backgroundSize: '300% 300%',
    background:
      'linear-gradient(96deg, rgba(201, 240, 55, 0.24) 5.38%, rgba(175, 214, 28, 0.64) 47.76%, rgba(178, 213, 48, 0.571429) 68.71%, rgba(178, 213, 48, 0.24) 101.12%)',
    animation: '$animated 10s linear infinite',
  },
  warningText: {
    color: theme.orange,
  },
})

interface Props extends WithStyles<typeof styles> {
  status?: MiningStatus
  runningTime?: number
  isRunning: boolean
  notCompatible: boolean
  onClick?: () => void
  pluginCount?: number
  isDesktop?: boolean
  isAuth?: boolean
}

class _StartButton extends Component<Props> {
  render() {
    const { status, runningTime, notCompatible, pluginCount, onClick, isRunning, isDesktop, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.buttonContainer}>
            <div className={classes.buttonBorder}>
              <div className={classes.buttonBorderInner}>
                <div
                  className={classnames(classes.button, {
                    [classes.running]: isRunning,
                    [classes.disabledButton]: notCompatible && !isRunning,
                  })}
                  onClick={onClick}
                >
                  {isRunning ? 'Stop' : 'Start'}
                </div>
              </div>
            </div>
          </div>
          <StatElement
            title={runningTime ? formatDuration(runningTime) : 'Status'}
            values={[`${(status || MiningStatus.Stopped).toUpperCase()}`]}
          />
        </div>
        {!isDesktop && <P>Mining is not currently supported in browsers</P>}
        {isDesktop && pluginCount === 0 && <P className={classes.warningText}>Unable to find any compatible miners</P>}
      </div>
    )
  }
}

export const StartButton = withStyles(styles)(_StartButton)
