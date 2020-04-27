import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { MiningStatus } from '../../machine/models'

const styles = (theme: SaladTheme) => ({
  container: {
    height: 100,
    width: 200,
    display: 'flex',
    padding: 30,
  },
  button: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskBook25,
    border: '1px solid black',
    fontSize: 18,
    textTransform: 'uppercase',
    flex: 1,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
  },
  enabledButton: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
  },
  disabledButton: {
    cursor: 'not-allowed',
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
})

interface Props extends WithStyles<typeof styles> {
  status?: MiningStatus
  isEnabled?: boolean
  onClick?: () => void
}

class _StartButton extends Component<Props> {
  handleClick = () => {
    const { onClick, isEnabled } = this.props

    if (!isEnabled) return

    onClick?.()
  }
  render() {
    const { status, isEnabled, classes } = this.props
    const isRunning =
      status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running

    return (
      <div className={classes.container}>
        <div
          className={classnames(classes.button, {
            [classes.running]: isRunning,
            [classes.enabledButton]: isEnabled,
            [classes.disabledButton]: !isEnabled,
          })}
          onClick={this.handleClick}
        >
          {isRunning ? 'Stop' : 'Start'}
        </div>
      </div>
    )
  }
}

export const StartButton = withStyles(styles)(_StartButton)
