import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { formatDuration } from '../../../utils'
import { MiningStatus } from '../../machine/models'

const buttonWidth = 120

const styles = (theme: SaladTheme) => ({
  startButtonContainer: {
    '-webkit-app-region': 'none',
    position: 'relative',
    width: buttonWidth + 15,
    paddingLeft: 10,
    height: '2rem',
  },
  startButton: {
    position: 'absolute',
    top: 0,
    height: 40,
    width: buttonWidth,
    transform: 'skew(-30deg)',
    background:
      'linear-gradient(104.2deg, rgba(201, 240, 55, 0) -28.93%, rgba(201, 240, 55, 0.5) 19.91%, rgba(201, 240, 55, 0.2) 49.73%, rgba(201, 240, 55, 0.3) 88.28%)',
    border: '1px solid rgba(201, 240, 55, 0.5)',
    color: '#fff',
    textShadow: '0px 0px 5px rgba(201, 240, 55, 0.9), -1px -1px 3px rgba(0, 0, 0, 0.25)',
    transition: 'box-shadow .1s cubic-bezier(0.47, 0, 0.75, 0.72)',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(201, 240, 55, 0.5)',
  },
  startButtonRunning: {
    boxShadow: '5px 5px 10px rgba(10, 33, 51, 0.3), 8px 12px 30px rgba(201, 240, 55, 0.3)',
  },
  startButtonText: {
    color: theme.darkBlue,
    position: 'absolute',
    top: 1,
    height: 40,
    width: buttonWidth,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    '-webkit-app-region': 'none',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    flexDirection: 'column',
  },
  startButtonTextDisabled: {
    cursor: 'not-allowed',
  },
  runningTimeText: {
    fontSize: 8,
    textAlign: 'center',
  },
  errorNotification: {
    // backgroundColor: theme.orange,
    position: 'absolute',
    top: 0,
    right: -12.5,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },

    // Triangle generated from http://apps.eky.hk/css-triangle-generator/
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '19.1px 11px 0 11px',
    borderColor: `${theme.orange} transparent transparent transparent`,
  },
  errorIcon: {
    position: 'absolute',
    color: 'white',
    top: -20,
    left: -2,
    fontWeight: 'bold',
  },
})

interface Props extends WithStyles<typeof styles> {
  onClick?: () => void
  onClickError?: () => void
  status?: MiningStatus
  isDisabled: boolean
  isRunning: boolean
  runningTime?: number
  notCompatible: boolean
}

interface State {
  isHovering: boolean
}

class _TitleStartButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isHovering: false,
    }
  }

  handleStart = () => {
    const { onClick } = this.props
    onClick?.()
  }

  handleErrorClick = () => {
    const { onClickError } = this.props

    onClickError?.()
  }

  handleMouseEnter = () => {
    this.setState({
      isHovering: true,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      isHovering: false,
    })
  }

  render() {
    const { notCompatible, isDisabled, isRunning, runningTime, status, classes } = this.props
    const { isHovering } = this.state

    const showStatus = isRunning && !isHovering

    return (
      <div className={classes.startButtonContainer}>
        <div className={classnames(classes.startButton, { [classes.startButtonRunning]: isRunning })} />

        <div
          className={classnames(classes.startButtonText, { [classes.startButtonTextDisabled]: isDisabled })}
          onClick={this.handleStart}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {!showStatus && <div>{isRunning ? 'Stop' : 'Start'}</div>}
          {showStatus && (
            <div>
              {status}
              <div className={classes.runningTimeText}>{runningTime !== undefined && formatDuration(runningTime)}</div>
            </div>
          )}
          {notCompatible && (
            <div className={classes.errorNotification} onClick={this.handleErrorClick}>
              <div className={classes.errorIcon}>!</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export const TitleStartButton = withStyles(styles)(_TitleStartButton)
