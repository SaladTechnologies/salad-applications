import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { formatDuration } from '../../../utils'
import { MiningStatus } from '../../machine/models'

const buttonWidth = 120
const buttonWidthLarge = 160

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
    background: '#B2D530',
    border: '1px solid rgba(201, 240, 55, 0.5)',
    color: '#fff',
    textShadow: '0px 0px 5px rgba(201, 240, 55, 0.9), -1px -1px 3px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(4px)',
  },
  startButtonInstalling: {
    background: '#DBF1C1',
  },
  startButtonPrepping10: {
    backgroundImage: 'linear-gradient(to right, #B2D530, #B2D530 10%, #DBF1C1 10%, #DBF1C1 90%)',
  },
  startButtonPrepping25: {
    backgroundImage: 'linear-gradient(to right, #B2D530, #B2D530 25%, #DBF1C1 25%, #DBF1C1 75%)',
  },
  startButtonPrepping60: {
    backgroundImage: 'linear-gradient(to right, #B2D530, #B2D530 60%, #DBF1C1 60%, #DBF1C1 40%)',
  },
  startButtonPrepping90: {
    backgroundImage: 'linear-gradient(to right, #B2D530, #B2D530 90%, #DBF1C1 90%, #DBF1C1 10%)',
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
  startButtonChopping: {
    animation: '$chopping 3s ease-in',
    background: '#B2D530',
    boxShadow: '0px 0px 24px rgba(178, 213, 48, 0.4), inset 0px 0px 30px #53A626',
    border: '1px solid #53A626',
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
  startButtonContainerLarge: {
    width: buttonWidthLarge + 15,
  },
  startButtonLarge: {
    height: 60,
    width: buttonWidthLarge,
  },
  startButtonTextLarge: {
    top: 3,
    height: 60,
    lineHeight: '130%',
    width: buttonWidthLarge,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 14,
  },
  runningTimeTextLarge: {
    fontSize: 10,
  },
  errorNotificationLarge: {
    top: -3,
    right: -20,
    borderWidth: '22.1px 14px 0 14px',
  },
  errorIconLarge: {
    top: -23,
    left: -2,
  },
})

interface Props extends WithStyles<typeof styles> {
  onClick?: () => void
  onClickError?: () => void
  status?: MiningStatus
  isLarge?: boolean
  isRunning: boolean
  runningTime?: number
  progress: number
}

interface State {
  isHovering: boolean
}

class _NewStartButton extends Component<Props, State> {
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
    const { isLarge, isRunning, onClickError, progress, runningTime, status, classes } = this.props
    const { isHovering } = this.state

    const showStatus = isRunning && !isHovering

    return (
      <div className={classnames(classes.startButtonContainer, { [classes.startButtonContainerLarge]: isLarge })}>
        <div
          className={classnames(classes.startButton, {
            [classes.startButtonLarge]: isLarge,
            [classes.startButtonInstalling]: status === MiningStatus.Installing,
            [classes.startButtonPrepping10]: status === MiningStatus.Initializing && progress <= 0.1,
            [classes.startButtonPrepping25]: status === MiningStatus.Initializing && progress > 0.1 && progress <= 0.2,
            [classes.startButtonPrepping60]: status === MiningStatus.Initializing && progress > 0.2 && progress <= 0.3,
            [classes.startButtonPrepping90]: status === MiningStatus.Initializing && progress >= 0.4,
            [classes.startButtonChopping]: status === MiningStatus.Running,
          })}
        />
        <div
          className={classnames(classes.startButtonText, { [classes.startButtonTextLarge]: isLarge })}
          onClick={this.handleStart}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {!showStatus && <div>{isRunning ? 'Stop' : 'Start'}</div>}
          {showStatus && (
            <div>
              {status}
              <div className={classnames(classes.runningTimeText, { [classes.runningTimeTextLarge]: isLarge })}>
                {runningTime !== undefined && formatDuration(runningTime)}
              </div>
            </div>
          )}
          {onClickError !== undefined && (
            <div
              className={classnames(classes.errorNotification, { [classes.errorNotificationLarge]: isLarge })}
              onClick={onClickError}
            >
              <div className={classnames(classes.errorIcon, { [classes.errorIconLarge]: isLarge })}>!</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export const NewStartButton = withStyles(styles)(_NewStartButton)
