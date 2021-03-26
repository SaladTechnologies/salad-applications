import classNames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { formatDuration } from '../../../utils'
import { MiningStatus } from '../../machine/models'

const buttonHeight = 40
const buttonWidth = 120
const skew = 30
const skewMarginleft = (Math.tan((skew * Math.PI) / 180) * buttonHeight) / 2

const styles = (theme: SaladTheme) => ({
  startButtonContainer: {
    '-webkit-app-region': 'none',
    position: 'relative',
    width: buttonWidth,
    marginRight: 30,
    height: '2rem',
  },
  button: {
    position: 'relative',
    transform: `skewX(-${skew}deg)`,
    width: buttonWidth,
    height: buttonHeight,
    marginLeft: skewMarginleft,
    backgroundColor: '#B2D530',
    border: '1px solid rgba(201, 240, 55, 0.5)',
  },
  buttonPrepping: {
    background: '#DBF1C1',
  },
  buttonChopping: {
    animation: '$chopping 3s ease-in',
    background: '#B2D530',
    boxShadow: '0px 0px 24px rgba(178, 213, 48, 0.4), inset 0px 0px 30px #53A626',
    border: '1px solid #53A626',
  },
  progress: {
    width: (props: Props) => (props.status === MiningStatus.Running ? '100%' : `${props.percentage}%`),
    height: 'inherit',
    overflow: 'hidden',
    position: 'relative',
    transition: (props: Props) => (props.status === MiningStatus.Running ? 'unset' : 'width 1s ease-in-out'),
    '&:before': {
      height: 'inherit',
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: buttonWidth,
      backgroundImage: 'linear-gradient(90deg, #B2D530, #ddf77e, #B2D530, #ddf77e)',
      backgroundSize: '300% 100%',
      backgroundRepeat: 'repeat-x',
      animation: '$moveBackground 1.5s linear infinite',
    },
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    transform: `skewX(${skew}deg)`,
  },
  buttonText: {
    color: theme.darkBlue,
    position: 'absolute',
    top: 0,
    height: buttonHeight,
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
  runningTimeText: {
    fontSize: 8,
    textAlign: 'center',
  },
  errorNotification: {
    position: 'absolute',
    top: -1,
    right: -13.5,
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
  '@keyframes chopping': {
    '0%': {
      boxShadow: '0px 0px 4px #DBF1C1, 0px 0px 34px rgba(83, 166, 38, 0.9), 0px 0px 14px #B2D530',
      border: '1px solid #DBF1C1',
    },
    '50%': { boxShadow: '0px 0px 14px #B2D530', border: '1px solid #53A626' },
    '100%': {
      boxShadow: '0px 0px 24px rgba(178, 213, 48, 0.4), inset 0px 0px 30px #53A626',
      border: '1px solid #53A626',
    },
  },
  '@keyframes moveBackground': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '100%': {
      backgroundPosition: '100% 0%',
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onClick?: () => void
  onClickError?: () => void
  status?: MiningStatus
  isRunning: boolean
  runningTime?: number
  percentage: number
}

interface State {
  isHovering: boolean
}

class _StartButton extends Component<Props, State> {
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
    const { isRunning, onClickError, runningTime, status, classes } = this.props
    const { isHovering } = this.state

    const showStatus = isRunning && !isHovering
    const isPrepping = status !== MiningStatus.Running && runningTime !== undefined
    const label = isPrepping
      ? status === MiningStatus.Installing
        ? MiningStatus.Installing
        : MiningStatus.Initializing
      : status

    return (
      <div className={classes.startButtonContainer}>
        <div
          className={classNames(classes.button, {
            [classes.buttonPrepping]: isPrepping,
            [classes.buttonChopping]: status === MiningStatus.Running,
          })}
        >
          <div
            className={classNames({
              [classes.progress]: isPrepping,
            })}
          />
          <div className={classes.content}>
            <div
              className={classes.buttonText}
              onClick={this.handleStart}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              {!showStatus && <div>{isRunning ? 'Stop' : 'Start'}</div>}
              {showStatus && (
                <div>
                  {label}
                  <div className={classes.runningTimeText}>
                    {runningTime !== undefined && formatDuration(runningTime)}
                  </div>
                </div>
              )}
              {onClickError !== undefined && (
                <div className={classes.errorNotification} onClick={onClickError}>
                  <div className={classes.errorIcon}>!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const StartButton = withStyles(styles)(_StartButton)
